import {
  ARFeeStructure,
  ARAttendance,
  LawType,
  FeeStructureType,
  CreditorsSlab,
  DEFAULT_CIRP_SLABS,
  CoCMeetingAttendance,
  ARClassMeetings,
  EventFeeLine,
  PeriodicFee
} from "@/types/ar";

// Mock data storage
const mockFeeStructures: ARFeeStructure[] = [
  {
    id: "fs-1",
    arId: "ar-john-smith",
    className: "Financial Creditors-Secured",
    lawType: "IBBI CIRP",
    structureType: "EventBasis",
    cirpSlabs: DEFAULT_CIRP_SLABS,
    selectedSlab: "101-1000",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  }
];

const mockAttendance: ARAttendance[] = [
  {
    id: "att-1",
    arId: "ar-john-smith",
    className: "Financial Creditors-Secured",
    cocMeetings: [
      {
        index: 1,
        date: "2025-01-05",
        ar1: "Present",
        ar2: "Not Applicable",
        payable: true,
        fee: 40000
      },
      {
        index: 2,
        date: "2025-01-12",
        ar1: "Present",
        ar2: "Not Applicable",
        payable: true,
        fee: 40000
      },
      {
        index: 3,
        date: "2025-01-18",
        ar1: "Absent",
        ar2: "Not Applicable",
        payable: false,
        fee: 0
      }
    ],
    classMeetings: [
      {
        id: "cm-1",
        arName: "John Smith",
        className: "Financial Creditors-Secured",
        meetings: [
          {
            id: "m-1",
            date: "2025-01-10",
            status: "Present",
            payable: true,
            fee: 12000
          },
          {
            id: "m-2",
            date: "2025-01-25",
            status: "Present",
            payable: true,
            fee: 12000
          }
        ]
      }
    ],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-25T00:00:00Z"
  }
];

/**
 * Get AR fee structure by AR ID and class name
 */
export async function getARFeeStructure(
  arId: string, 
  className: string
): Promise<ARFeeStructure | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const feeStructure = mockFeeStructures.find(
    fs => fs.arId === arId && fs.className === className
  );
  
  return feeStructure || null;
}

/**
 * Save AR fee structure
 */
export async function saveARFeeStructure(
  arId: string,
  className: string,
  data: Partial<ARFeeStructure>
): Promise<ARFeeStructure> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const existingIndex = mockFeeStructures.findIndex(
    fs => fs.arId === arId && fs.className === className
  );
  
  const now = new Date().toISOString();
  
  if (existingIndex >= 0) {
    // Update existing
    mockFeeStructures[existingIndex] = {
      ...mockFeeStructures[existingIndex],
      ...data,
      updatedAt: now
    };
    return mockFeeStructures[existingIndex];
  } else {
    // Create new
    const newFeeStructure: ARFeeStructure = {
      id: `fs-${Date.now()}`,
      arId,
      className,
      lawType: "IBBI CIRP",
      structureType: "EventBasis",
      createdAt: now,
      updatedAt: now,
      ...data
    };
    mockFeeStructures.push(newFeeStructure);
    return newFeeStructure;
  }
}

/**
 * Get AR attendance by AR ID and class name
 */
export async function getAttendance(
  arId: string,
  className: string
): Promise<ARAttendance | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const attendance = mockAttendance.find(
    att => att.arId === arId && att.className === className
  );
  
  return attendance || null;
}

/**
 * Save AR attendance
 */
export async function saveAttendance(
  arId: string,
  className: string,
  data: Partial<ARAttendance>
): Promise<ARAttendance> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const existingIndex = mockAttendance.findIndex(
    att => att.arId === arId && att.className === className
  );
  
  const now = new Date().toISOString();
  
  if (existingIndex >= 0) {
    // Update existing
    mockAttendance[existingIndex] = {
      ...mockAttendance[existingIndex],
      ...data,
      updatedAt: now
    };
    return mockAttendance[existingIndex];
  } else {
    // Create new
    const newAttendance: ARAttendance = {
      id: `att-${Date.now()}`,
      arId,
      className,
      cocMeetings: [],
      classMeetings: [],
      createdAt: now,
      updatedAt: now,
      ...data
    };
    mockAttendance.push(newAttendance);
    return newAttendance;
  }
}

/**
 * Add a new CoC meeting to attendance
 */
export async function addCoCMeeting(
  arId: string,
  className: string,
  meeting: Omit<CoCMeetingAttendance, 'index' | 'payable' | 'fee'>
): Promise<ARAttendance> {
  const attendance = await getAttendance(arId, className);
  
  if (!attendance) {
    throw new Error("Attendance record not found");
  }
  
  const newIndex = Math.max(0, ...attendance.cocMeetings.map(m => m.index)) + 1;
  const newMeeting: CoCMeetingAttendance = {
    ...meeting,
    index: newIndex,
    payable: false, // Will be computed
    fee: 0 // Will be computed
  };
  
  const updatedAttendance = {
    ...attendance,
    cocMeetings: [...attendance.cocMeetings, newMeeting]
  };
  
  return await saveAttendance(arId, className, updatedAttendance);
}

/**
 * Add a new class meeting to attendance
 */
export async function addClassMeeting(
  arId: string,
  className: string,
  arName: string,
  meetingDate: string,
  status: "Present" | "Absent" | "Not Applicable" = "Present"
): Promise<ARAttendance> {
  const attendance = await getAttendance(arId, className);
  
  if (!attendance) {
    throw new Error("Attendance record not found");
  }
  
  const existingClassIndex = attendance.classMeetings.findIndex(
    cm => cm.arName === arName && cm.className === className
  );
  
  const newMeeting = {
    id: `m-${Date.now()}`,
    date: meetingDate,
    status,
    payable: false, // Will be computed
    fee: 0 // Will be computed
  };
  
  let updatedClassMeetings: ARClassMeetings[];
  
  if (existingClassIndex >= 0) {
    // Add to existing class meetings
    updatedClassMeetings = [...attendance.classMeetings];
    updatedClassMeetings[existingClassIndex] = {
      ...updatedClassMeetings[existingClassIndex],
      meetings: [...updatedClassMeetings[existingClassIndex].meetings, newMeeting]
    };
  } else {
    // Create new class meetings entry
    const newClassMeetings: ARClassMeetings = {
      id: `cm-${Date.now()}`,
      arName,
      className,
      meetings: [newMeeting]
    };
    updatedClassMeetings = [...attendance.classMeetings, newClassMeetings];
  }
  
  const updatedAttendance = {
    ...attendance,
    classMeetings: updatedClassMeetings
  };
  
  return await saveAttendance(arId, className, updatedAttendance);
}

/**
 * Create default fee structure for CIRP
 */
export function createDefaultCirpFeeStructure(
  arId: string,
  className: string,
  selectedSlab: CreditorsSlab = "101-1000"
): ARFeeStructure {
  return {
    id: `fs-${Date.now()}`,
    arId,
    className,
    lawType: "IBBI CIRP",
    structureType: "EventBasis",
    cirpSlabs: DEFAULT_CIRP_SLABS,
    selectedSlab,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Create default attendance record
 */
export function createDefaultAttendance(
  arId: string,
  className: string
): ARAttendance {
  return {
    id: `att-${Date.now()}`,
    arId,
    className,
    cocMeetings: [],
    classMeetings: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Get all fee structures (for admin/debugging)
 */
export async function getAllFeeStructures(): Promise<ARFeeStructure[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...mockFeeStructures];
}

/**
 * Get all attendance records (for admin/debugging)
 */
export async function getAllAttendance(): Promise<ARAttendance[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...mockAttendance];
}
