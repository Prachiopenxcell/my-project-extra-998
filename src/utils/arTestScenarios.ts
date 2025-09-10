import {
  ARFeeStructure,
  ARAttendance,
  FeeComputationInput,
  CreditorsSlab,
  DEFAULT_CIRP_SLABS
} from "@/types/ar";
import { computeArFees } from "@/services/arFeeService";

/**
 * Test scenarios to validate AR Fee Structure and Attendance functionality
 */

// Test Scenario 1: CIRP with 101-1000 creditors, mixed attendance
export const cirpScenario1: FeeComputationInput = {
  feeStructure: {
    id: "test-fs-1",
    arId: "test-ar-1",
    className: "Financial Creditors-Secured",
    lawType: "IBBI CIRP",
    structureType: "EventBasis",
    cirpSlabs: DEFAULT_CIRP_SLABS,
    selectedSlab: "101-1000",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  creditorsSlab: "101-1000",
  attendance: {
    id: "test-att-1",
    arId: "test-ar-1",
    className: "Financial Creditors-Secured",
    cocMeetings: [
      { index: 1, date: "2025-01-05", ar1: "Present", ar2: "Not Applicable" },
      { index: 2, date: "2025-01-12", ar1: "Present", ar2: "Not Applicable" },
      { index: 3, date: "2025-01-18", ar1: "Absent", ar2: "Not Applicable" },
      { index: 4, date: "2025-01-25", ar1: "Present", ar2: "Not Applicable" } // Should be unpaid (>2)
    ],
    classMeetings: [
      {
        id: "test-cm-1",
        arName: "Test AR",
        className: "Financial Creditors-Secured",
        meetings: [
          { id: "m1", date: "2025-01-10", status: "Present" }, // Paid
          { id: "m2", date: "2025-01-17", status: "Present" }, // Paid
          { id: "m3", date: "2025-01-24", status: "Present" }  // Unpaid (>2)
        ]
      }
    ],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-24T00:00:00Z"
  }
};

// Test Scenario 2: CIRP with 10-100 creditors (lower slab)
export const cirpScenario2: FeeComputationInput = {
  feeStructure: {
    id: "test-fs-2",
    arId: "test-ar-2",
    className: "Financial Creditors-Unsecured",
    lawType: "IBBI CIRP",
    structureType: "EventBasis",
    cirpSlabs: DEFAULT_CIRP_SLABS,
    selectedSlab: "10-100",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  creditorsSlab: "10-100",
  attendance: {
    id: "test-att-2",
    arId: "test-ar-2",
    className: "Financial Creditors-Unsecured",
    cocMeetings: [
      { index: 1, date: "2025-01-05", ar1: "Present", ar2: "Present" }, // Both present
      { index: 2, date: "2025-01-12", ar1: "Absent", ar2: "Present" }   // One present
    ],
    classMeetings: [
      {
        id: "test-cm-2",
        arName: "Test AR 2",
        className: "Financial Creditors-Unsecured",
        meetings: [
          { id: "m1", date: "2025-01-10", status: "Present" },
          { id: "m2", date: "2025-01-17", status: "Absent" }
        ]
      }
    ],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-17T00:00:00Z"
  }
};

// Test Scenario 3: Non-CIRP law with event-based fees
export const nonCirpScenario: FeeComputationInput = {
  feeStructure: {
    id: "test-fs-3",
    arId: "test-ar-3",
    className: "SEBI Creditors",
    lawType: "SEBI",
    structureType: "EventBasis",
    eventFees: [
      {
        id: "ef1",
        trigger: "Attendance Marked",
        amount: 25000,
        legalRange: { min: 15000, max: 60000, currency: "INR" }
      },
      {
        id: "ef2",
        trigger: "Meeting Created",
        amount: 15000,
        legalRange: { min: 10000, max: 50000, currency: "INR" }
      }
    ],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  creditorsSlab: "101-1000",
  attendance: {
    id: "test-att-3",
    arId: "test-ar-3",
    className: "SEBI Creditors",
    cocMeetings: [
      { index: 1, date: "2025-01-05", ar1: "Present", ar2: "Not Applicable" },
      { index: 2, date: "2025-01-12", ar1: "Present", ar2: "Not Applicable" }
    ],
    classMeetings: [
      {
        id: "test-cm-3",
        arName: "Test AR 3",
        className: "SEBI Creditors",
        meetings: [
          { id: "m1", date: "2025-01-10", status: "Present" },
          { id: "m2", date: "2025-01-17", status: "Present" }
        ]
      }
    ],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-17T00:00:00Z"
  }
};

/**
 * Run all test scenarios and validate results
 */
export function runAllTestScenarios() {
  console.log("🧪 Running AR Fee Structure Test Scenarios...\n");

  // Test CIRP Scenario 1 (101-1000 creditors)
  console.log("📋 Test 1: CIRP with 101-1000 creditors");
  const result1 = computeArFees(cirpScenario1);
  console.log("Expected: CoC Paid=2, CoC Unpaid=2, CoC Total=₹80,000");
  console.log("Expected: Class Paid=2, Class Unpaid=1, Class Total=₹24,000");
  console.log("Expected: AR Total=₹104,000, Facilitator=₹20,800");
  console.log("Actual:", {
    cocPaid: result1.cocPaidCount,
    cocUnpaid: result1.cocUnpaidCount,
    cocTotal: result1.cocTotal,
    classTotal: result1.classTotal,
    arTotal: result1.arMeetingFeesTotal,
    facilitatorFee: result1.facilitatorFee
  });
  console.log("✅ Test 1 Complete\n");

  // Test CIRP Scenario 2 (10-100 creditors)
  console.log("📋 Test 2: CIRP with 10-100 creditors");
  const result2 = computeArFees(cirpScenario2);
  console.log("Expected: CoC Fee=₹30,000, Class Fee=₹10,000");
  console.log("Expected: CoC Total=₹60,000, Class Total=₹10,000");
  console.log("Expected: AR Total=₹70,000, Facilitator=₹14,000");
  console.log("Actual:", {
    cocFeePerMeeting: result2.cocFeePerMeeting,
    cocTotal: result2.cocTotal,
    classTotal: result2.classTotal,
    arTotal: result2.arMeetingFeesTotal,
    facilitatorFee: result2.facilitatorFee
  });
  console.log("✅ Test 2 Complete\n");

  // Test Non-CIRP Scenario
  console.log("📋 Test 3: Non-CIRP (SEBI) with event-based fees");
  const result3 = computeArFees(nonCirpScenario);
  console.log("Expected: Event-based calculation with attendance trigger");
  console.log("Expected: 4 Present attendances × ₹25,000 + ₹15,000 = ₹115,000");
  console.log("Expected: Facilitator = ₹23,000");
  console.log("Actual:", {
    arTotal: result3.arMeetingFeesTotal,
    facilitatorFee: result3.facilitatorFee,
    warnings: result3.validationWarnings
  });
  console.log("✅ Test 3 Complete\n");

  console.log("🎉 All test scenarios completed!");
  return { result1, result2, result3 };
}

/**
 * Validate specific business rules
 */
export function validateBusinessRules() {
  console.log("🔍 Validating Business Rules...\n");

  const results = runAllTestScenarios();

  // Rule 1: CIRP only pays first 2 CoC meetings
  const rule1Pass = results.result1.cocPaidCount === 2 && results.result1.cocUnpaidCount === 2;
  console.log(`Rule 1 - CIRP CoC Payment Limit: ${rule1Pass ? '✅ PASS' : '❌ FAIL'}`);

  // Rule 2: CIRP only pays first 2 class meetings per class
  const rule2Pass = results.result1.classTotal === 24000; // 2 meetings × ₹12,000
  console.log(`Rule 2 - CIRP Class Payment Limit: ${rule2Pass ? '✅ PASS' : '❌ FAIL'}`);

  // Rule 3: Facilitator fee is 20% of AR meeting fees
  const rule3Pass = results.result1.facilitatorFee === Math.round(results.result1.arMeetingFeesTotal * 0.2);
  console.log(`Rule 3 - Facilitator Fee Calculation: ${rule3Pass ? '✅ PASS' : '❌ FAIL'}`);

  // Rule 4: Different slabs have different amounts
  const rule4Pass = results.result2.cocFeePerMeeting === 30000; // 10-100 slab
  console.log(`Rule 4 - Slab-based Fee Amounts: ${rule4Pass ? '✅ PASS' : '❌ FAIL'}`);

  // Rule 5: Non-CIRP laws allow all meetings to be paid
  const rule5Pass = results.result3.arMeetingFeesTotal > 0;
  console.log(`Rule 5 - Non-CIRP Payment Rules: ${rule5Pass ? '✅ PASS' : '❌ FAIL'}`);

  console.log("\n🏁 Business Rule Validation Complete!");
}
