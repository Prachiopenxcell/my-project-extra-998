import {
  FeeComputationInput,
  FeeBreakdown,
  ARFeeStructure,
  ARAttendance,
  CreditorsSlab,
  DEFAULT_CIRP_SLABS,
  LEGAL_RANGES,
  AttendanceStatus
} from "@/types/ar";

/**
 * Core fee computation logic for AR fees based on law type, attendance, and slab
 */
export function computeArFees(input: FeeComputationInput): FeeBreakdown {
  const { feeStructure, attendance, creditorsSlab, options = {} } = input;
  const warnings: string[] = [];

  // Initialize result
  const result: FeeBreakdown = {
    cocPaidCount: 0,
    cocUnpaidCount: 0,
    cocFeePerMeeting: 0,
    cocTotal: 0,
    classPaidByClass: {},
    classUnpaidByClass: {},
    classFeePerMeetingByClass: {},
    classTotal: 0,
    arMeetingFeesTotal: 0,
    facilitatorFee: 0,
    validationWarnings: warnings
  };

  if (feeStructure.lawType === "IBBI CIRP") {
    return computeCirpFees(feeStructure, attendance, creditorsSlab, result, options);
  } else {
    return computeNonCirpFees(feeStructure, attendance, result, warnings);
  }
}

/**
 * CIRP-specific fee computation with slab-based amounts and attendance rules
 */
function computeCirpFees(
  feeStructure: ARFeeStructure,
  attendance: ARAttendance,
  creditorsSlab: CreditorsSlab,
  result: FeeBreakdown,
  options: { chargePerAR?: boolean }
): FeeBreakdown {
  const cirpSlabs = feeStructure.cirpSlabs || DEFAULT_CIRP_SLABS;
  const cocPerMeeting = cirpSlabs.cocFeePerMeeting[creditorsSlab];
  const classPerMeeting = cirpSlabs.classFeePerMeeting[creditorsSlab];
  
  result.cocFeePerMeeting = cocPerMeeting;

  // CoC meetings: paid only for first two where Present by at least one AR
  let cocPaidSoFar = 0;
  for (const row of attendance.cocMeetings) {
    const isPresent = row.ar1 === "Present" || (row.ar2 && row.ar2 === "Present");
    
    if (!isPresent) {
      result.cocUnpaidCount += 1;
      continue;
    }
    
    if (cocPaidSoFar < 2) {
      result.cocPaidCount += 1;
      let meetingFee = cocPerMeeting;
      
      // Optional: charge per AR if both present and option enabled
      if (options.chargePerAR && row.ar1 === "Present" && row.ar2 === "Present") {
        meetingFee = cocPerMeeting * 2;
      }
      
      result.cocTotal += meetingFee;
      cocPaidSoFar += 1;
    } else {
      result.cocUnpaidCount += 1;
    }
  }

  // Class meetings: per class, pay only first two Present meetings
  for (const cm of attendance.classMeetings) {
    const classKey = cm.className;
    let paidForThisClass = 0;
    let paidCount = 0;
    let unpaidCount = 0;
    
    for (const m of cm.meetings) {
      if (m.status !== "Present") {
        unpaidCount += 1;
        continue;
      }
      
      if (paidForThisClass < 2) {
        paidCount += 1;
        paidForThisClass += 1;
      } else {
        unpaidCount += 1;
      }
    }
    
    result.classPaidByClass[classKey] = (result.classPaidByClass[classKey] ?? 0) + paidCount;
    result.classUnpaidByClass[classKey] = (result.classUnpaidByClass[classKey] ?? 0) + unpaidCount;
    result.classFeePerMeetingByClass[classKey] = classPerMeeting;
    result.classTotal += paidCount * classPerMeeting;
  }

  result.arMeetingFeesTotal = result.cocTotal + result.classTotal;
  result.facilitatorFee = Math.round(result.arMeetingFeesTotal * 0.2);
  
  return result;
}

/**
 * Non-CIRP fee computation with configurable event/periodic/fixed fees
 */
function computeNonCirpFees(
  feeStructure: ARFeeStructure,
  attendance: ARAttendance,
  result: FeeBreakdown,
  warnings: string[]
): FeeBreakdown {
  let total = 0;

  // Event-based fees
  if (feeStructure.eventFees?.length) {
    for (const line of feeStructure.eventFees) {
      let eventTotal = 0;
      
      // Apply trigger-specific logic
      if (line.trigger === "Attendance Marked") {
        const presentCount =
          attendance.cocMeetings.filter(m => 
            m.ar1 === "Present" || (m.ar2 && m.ar2 === "Present")
          ).length +
          attendance.classMeetings.flatMap(cm => cm.meetings)
            .filter(m => m.status === "Present").length;
        eventTotal = presentCount * line.amount;
      } else {
        // Other triggers: count as single occurrence per trigger type
        eventTotal = line.amount;
      }
      
      total += eventTotal;

      // Validate against legal ranges
      if (line.legalRange) {
        const { min, max } = line.legalRange;
        if ((min !== undefined && line.amount < min) || 
            (max !== undefined && line.amount > max)) {
          warnings.push(
            `Event fee "${line.trigger}" amount ₹${line.amount.toLocaleString()} is outside legal range [₹${min?.toLocaleString() ?? "-"}, ₹${max?.toLocaleString() ?? "-"}].`
          );
        }
      }
    }
  }

  // Periodic fees
  if (feeStructure.periodicFees?.length) {
    for (const pf of feeStructure.periodicFees) {
      // For now, add full amount - in production, pro-rate by billing period
      total += pf.amount;
    }
  }

  // Fixed/Lump sum fees
  if (feeStructure.fixedFee?.amount) {
    total += feeStructure.fixedFee.amount;
  }

  result.arMeetingFeesTotal = total;
  result.facilitatorFee = Math.round(total * 0.2);
  result.validationWarnings = warnings;
  
  return result;
}

/**
 * Get default CIRP slab configuration
 */
export function getCirpDefaults(): typeof DEFAULT_CIRP_SLABS {
  return DEFAULT_CIRP_SLABS;
}

/**
 * Get legal ranges for a specific law type and event trigger
 */
export function getLegalRange(lawType: string, trigger: string) {
  const lawRanges = LEGAL_RANGES[lawType as keyof typeof LEGAL_RANGES];
  if (!lawRanges) return undefined;
  
  return lawRanges[trigger as keyof typeof lawRanges];
}

/**
 * Validate fee amount against legal range
 */
export function validateFeeAmount(
  lawType: string, 
  trigger: string, 
  amount: number
): { isValid: boolean; warning?: string } {
  const range = getLegalRange(lawType, trigger);
  if (!range) return { isValid: true };
  
  const { min, max } = range;
  const isValid = (min === undefined || amount >= min) && 
                  (max === undefined || amount <= max);
  
  if (!isValid) {
    return {
      isValid: false,
      warning: `Amount ₹${amount.toLocaleString()} is outside legal range [₹${min?.toLocaleString() ?? "-"}, ₹${max?.toLocaleString() ?? "-"}]`
    };
  }
  
  return { isValid: true };
}

/**
 * Calculate payable status and fee for a CoC meeting
 */
export function calculateCoCMeetingFee(
  meetingIndex: number,
  ar1Status: AttendanceStatus,
  ar2Status: AttendanceStatus | undefined,
  feePerMeeting: number,
  isCirp: boolean = true
): { payable: boolean; fee: number } {
  const isPresent = ar1Status === "Present" || (ar2Status && ar2Status === "Present");
  
  if (!isPresent) {
    return { payable: false, fee: 0 };
  }
  
  if (isCirp && meetingIndex > 2) {
    return { payable: false, fee: 0 }; // CIRP: only first 2 meetings are paid
  }
  
  return { payable: true, fee: feePerMeeting };
}

/**
 * Calculate payable status and fee for class meetings
 */
export function calculateClassMeetingFees(
  meetings: Array<{ status: AttendanceStatus }>,
  feePerMeeting: number,
  isCirp: boolean = true
): Array<{ payable: boolean; fee: number }> {
  let paidCount = 0;
  
  return meetings.map(meeting => {
    if (meeting.status !== "Present") {
      return { payable: false, fee: 0 };
    }
    
    if (isCirp && paidCount >= 2) {
      return { payable: false, fee: 0 }; // CIRP: only first 2 Present meetings are paid
    }
    
    paidCount++;
    return { payable: true, fee: feePerMeeting };
  });
}
