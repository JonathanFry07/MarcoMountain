// Mock exercise data
export const exerciseData = {
    benchPress: {
      name: "Bench Press",
      oneRepMax: 120, // estimated 1RM
      sessions: [
        { date: "Jan 1", weight: 80, reps: 8, sets: 3, targetWeight: 85, targetReps: 10, restTime: 90 },
        { date: "Jan 8", weight: 82.5, reps: 8, sets: 3, targetWeight: 85, targetReps: 10, restTime: 90 },
        { date: "Jan 15", weight: 85, reps: 7, sets: 3, targetWeight: 87.5, targetReps: 8, restTime: 120 },
        { date: "Jan 22", weight: 85, reps: 8, sets: 3, targetWeight: 87.5, targetReps: 10, restTime: 90 },
        { date: "Jan 29", weight: 87.5, reps: 6, sets: 3, targetWeight: 90, targetReps: 8, restTime: 120 },
        { date: "Feb 5", weight: 87.5, reps: 8, sets: 3, targetWeight: 90, targetReps: 10, restTime: 90 },
        { date: "Feb 12", weight: 90, reps: 6, sets: 3, targetWeight: 92.5, targetReps: 8, restTime: 120 },
        { date: "Feb 19", weight: 90, reps: 7, sets: 4, targetWeight: 92.5, targetReps: 8, restTime: 120 },
        { date: "Feb 26", weight: 92.5, reps: 5, sets: 4, targetWeight: 95, targetReps: 6, restTime: 150 },
        { date: "Mar 5", weight: 92.5, reps: 6, sets: 4, targetWeight: 95, targetReps: 8, restTime: 120 },
      ],
    },
    squat: {
      name: "Squat",
      oneRepMax: 160,
      sessions: [
        { date: "Jan 3", weight: 100, reps: 6, sets: 3, targetWeight: 105, targetReps: 8, restTime: 120 },
        { date: "Jan 10", weight: 105, reps: 5, sets: 3, targetWeight: 110, targetReps: 6, restTime: 150 },
        { date: "Jan 17", weight: 105, reps: 6, sets: 3, targetWeight: 110, targetReps: 8, restTime: 120 },
        { date: "Jan 24", weight: 110, reps: 5, sets: 3, targetWeight: 115, targetReps: 6, restTime: 150 },
        { date: "Jan 31", weight: 110, reps: 6, sets: 3, targetWeight: 115, targetReps: 8, restTime: 120 },
        { date: "Feb 7", weight: 115, reps: 5, sets: 3, targetWeight: 120, targetReps: 6, restTime: 150 },
        { date: "Feb 14", weight: 115, reps: 6, sets: 3, targetWeight: 120, targetReps: 8, restTime: 120 },
        { date: "Feb 21", weight: 120, reps: 4, sets: 4, targetWeight: 125, targetReps: 5, restTime: 180 },
        { date: "Feb 28", weight: 120, reps: 5, sets: 4, targetWeight: 125, targetReps: 6, restTime: 150 },
        { date: "Mar 7", weight: 125, reps: 4, sets: 4, targetWeight: 130, targetReps: 5, restTime: 180 },
      ],
    },
    deadlift: {
      name: "Deadlift",
      oneRepMax: 180,
      sessions: [
        { date: "Jan 5", weight: 120, reps: 5, sets: 2, targetWeight: 125, targetReps: 6, restTime: 180 },
        { date: "Jan 12", weight: 125, reps: 4, sets: 2, targetWeight: 130, targetReps: 5, restTime: 210 },
        { date: "Jan 19", weight: 125, reps: 5, sets: 2, targetWeight: 130, targetReps: 6, restTime: 180 },
        { date: "Jan 26", weight: 130, reps: 4, sets: 2, targetWeight: 135, targetReps: 5, restTime: 210 },
        { date: "Feb 2", weight: 130, reps: 5, sets: 2, targetWeight: 135, targetReps: 6, restTime: 180 },
        { date: "Feb 9", weight: 135, reps: 3, sets: 3, targetWeight: 140, targetReps: 4, restTime: 240 },
        { date: "Feb 16", weight: 135, reps: 4, sets: 3, targetWeight: 140, targetReps: 5, restTime: 210 },
        { date: "Feb 23", weight: 140, reps: 3, sets: 3, targetWeight: 145, targetReps: 4, restTime: 240 },
        { date: "Mar 1", weight: 140, reps: 4, sets: 3, targetWeight: 145, targetReps: 5, restTime: 210 },
        { date: "Mar 8", weight: 145, reps: 3, sets: 3, targetWeight: 150, targetReps: 4, restTime: 240 },
      ],
    },
    overheadPress: {
      name: "Overhead Press",
      oneRepMax: 80,
      sessions: [
        { date: "Jan 2", weight: 50, reps: 8, sets: 3, targetWeight: 52.5, targetReps: 8, restTime: 90 },
        { date: "Jan 9", weight: 52.5, reps: 6, sets: 3, targetWeight: 55, targetReps: 6, restTime: 120 },
        { date: "Jan 16", weight: 52.5, reps: 7, sets: 3, targetWeight: 55, targetReps: 8, restTime: 90 },
        { date: "Jan 23", weight: 55, reps: 5, sets: 3, targetWeight: 57.5, targetReps: 6, restTime: 120 },
        { date: "Jan 30", weight: 55, reps: 6, sets: 3, targetWeight: 57.5, targetReps: 8, restTime: 90 },
        { date: "Feb 6", weight: 57.5, reps: 4, sets: 3, targetWeight: 60, targetReps: 5, restTime: 120 },
        { date: "Feb 13", weight: 57.5, reps: 5, sets: 3, targetWeight: 60, targetReps: 6, restTime: 120 },
        { date: "Feb 20", weight: 57.5, reps: 6, sets: 3, targetWeight: 60, targetReps: 8, restTime: 90 },
        { date: "Feb 27", weight: 60, reps: 4, sets: 4, targetWeight: 62.5, targetReps: 5, restTime: 120 },
        { date: "Mar 6", weight: 60, reps: 5, sets: 4, targetWeight: 62.5, targetReps: 6, restTime: 120 },
      ],
    },
  }
  
  // Cardio data
  export const cardioData = {
    running: {
      name: "Running",
      sessions: [
        { date: "Jan 2", distance: 3.5, duration: 28, targetDistance: 4.0 },
        { date: "Jan 9", distance: 4.0, duration: 31, targetDistance: 4.5 },
        { date: "Jan 16", distance: 4.2, duration: 32, targetDistance: 4.5 },
        { date: "Jan 23", distance: 4.5, duration: 33, targetDistance: 5.0 },
        { date: "Jan 30", distance: 5.0, duration: 36, targetDistance: 5.0 },
        { date: "Feb 6", distance: 5.2, duration: 37, targetDistance: 5.5 },
        { date: "Feb 13", distance: 5.5, duration: 38, targetDistance: 6.0 },
        { date: "Feb 20", distance: 6.0, duration: 41, targetDistance: 6.0 },
        { date: "Feb 27", distance: 6.2, duration: 42, targetDistance: 6.5 },
        { date: "Mar 6", distance: 6.5, duration: 43, targetDistance: 7.0 },
      ],
    },
    cycling: {
      name: "Cycling",
      sessions: [
        { date: "Jan 3", distance: 10.0, duration: 35, targetDistance: 12.0 },
        { date: "Jan 10", distance: 12.0, duration: 40, targetDistance: 15.0 },
        { date: "Jan 17", distance: 15.0, duration: 48, targetDistance: 15.0 },
        { date: "Jan 24", distance: 16.5, duration: 52, targetDistance: 18.0 },
        { date: "Jan 31", distance: 18.0, duration: 56, targetDistance: 20.0 },
        { date: "Feb 7", distance: 20.0, duration: 60, targetDistance: 22.0 },
        { date: "Feb 14", distance: 22.0, duration: 65, targetDistance: 25.0 },
        { date: "Feb 21", distance: 25.0, duration: 72, targetDistance: 25.0 },
        { date: "Feb 28", distance: 27.5, duration: 78, targetDistance: 30.0 },
        { date: "Mar 7", distance: 30.0, duration: 84, targetDistance: 32.0 },
      ],
    },
    swimming: {
      name: "Swimming",
      sessions: [
        { date: "Jan 4", distance: 0.8, duration: 25, targetDistance: 1.0 },
        { date: "Jan 11", distance: 1.0, duration: 30, targetDistance: 1.2 },
        { date: "Jan 18", distance: 1.2, duration: 35, targetDistance: 1.5 },
        { date: "Jan 25", distance: 1.5, duration: 42, targetDistance: 1.5 },
        { date: "Feb 1", distance: 1.6, duration: 44, targetDistance: 1.8 },
        { date: "Feb 8", distance: 1.8, duration: 48, targetDistance: 2.0 },
        { date: "Feb 15", distance: 2.0, duration: 52, targetDistance: 2.0 },
        { date: "Feb 22", distance: 2.2, duration: 56, targetDistance: 2.5 },
        { date: "Mar 1", distance: 2.4, duration: 60, targetDistance: 2.5 },
        { date: "Mar 8", distance: 2.5, duration: 62, targetDistance: 3.0 },
      ],
    },
    rowing: {
      name: "Rowing",
      sessions: [
        { date: "Jan 5", distance: 2.0, duration: 15, targetDistance: 2.5 },
        { date: "Jan 12", distance: 2.5, duration: 18, targetDistance: 3.0 },
        { date: "Jan 19", distance: 3.0, duration: 21, targetDistance: 3.5 },
        { date: "Jan 26", distance: 3.5, duration: 24, targetDistance: 4.0 },
        { date: "Feb 2", distance: 4.0, duration: 27, targetDistance: 4.5 },
        { date: "Feb 9", distance: 4.5, duration: 30, targetDistance: 5.0 },
        { date: "Feb 16", distance: 5.0, duration: 32, targetDistance: 5.5 },
        { date: "Feb 23", distance: 5.5, duration: 35, targetDistance: 6.0 },
        { date: "Mar 2", distance: 6.0, duration: 37, targetDistance: 6.5 },
        { date: "Mar 9", distance: 6.5, duration: 39, targetDistance: 7.0 },
      ],
    },
  }
  
  // Personal records data
  export const personalRecordsData = [
    { exercise: "Bench Press", weight: 100, date: "Feb 12, 2023" },
    { exercise: "Squat", weight: 140, date: "Mar 7, 2023" },
    { exercise: "Deadlift", weight: 160, date: "Jan 15, 2023" },
    { exercise: "Overhead Press", weight: 65, date: "Feb 27, 2023" },
  ]
  
  // Strength balance data
  export const strengthBalanceData = [
    { area: "Chest", value: 80, ideal: 90 },
    { area: "Back", value: 75, ideal: 85 },
    { area: "Legs", value: 70, ideal: 95 },
    { area: "Shoulders", value: 85, ideal: 90 },
    { area: "Arms", value: 90, ideal: 80 },
  ]
  
  // Enhanced recovery analysis data
  export const recoveryData = {
    chest: {
      currentRecovery: 85,
      lastTrained: 3,
      recoveryRate: 25,
      fatigue: {
        level: 15,
        description: "Minimal fatigue present. Muscle is responsive and ready for training.",
      },
      trainingParameters: {
        volume: "Normal (8-12 sets)",
        intensity: "85-95% of normal",
        rest: "60-90 seconds",
        focus: "Strength/Hypertrophy",
      },
      recoveryFactors: [
        { name: "Sleep Quality", impact: 90 },
        { name: "Nutrition", impact: 85 },
        { name: "Stress Level", impact: 75 },
        { name: "Hydration", impact: 95 },
      ],
      timeline: [
        { day: "Today", recovery: 85, recommendation: "Ready for Training" },
        { day: "Tomorrow", recovery: 95, recommendation: "Optimal Training" },
        { day: "Day 3", recovery: 100, recommendation: "Peak Performance" },
        { day: "Day 4", recovery: 100, recommendation: "Peak Performance" },
        { day: "Day 5", recovery: 100, recommendation: "Peak Performance" },
        { day: "Day 6", recovery: 95, recommendation: "Optimal Training" },
        { day: "Day 7", recovery: 90, recommendation: "Ready for Training" },
      ],
      optimalWindows: [
        { day: "Today", optimal: true, description: "Good training window (85% recovered)" },
        { day: "Tomorrow", optimal: true, description: "Optimal training window (95% recovered)" },
        { day: "Day 3", optimal: true, description: "Peak performance window (100% recovered)" },
        { day: "Day 4", optimal: false, description: "Consider training other muscle groups" },
        { day: "Day 5", optimal: false, description: "Consider training other muscle groups" },
      ],
      recoveryStrategies: [
        { name: "Active Recovery", description: "Light movement to increase blood flow without fatigue" },
        { name: "Protein Timing", description: "25-30g protein within 2 hours post-workout" },
        { name: "Contrast Therapy", description: "Alternating hot and cold exposure to reduce inflammation" },
        { name: "Sleep Optimization", description: "Aim for 7-9 hours of quality sleep" },
      ],
      fiberBreakdown: {
        typeI: {
          recovery: 95,
          note: "Slow twitch fibers recover quickly and are almost fully restored",
        },
        typeIIa: {
          recovery: 85,
          note: "Intermediate fast twitch fibers are well recovered",
        },
        typeIIx: {
          recovery: 75,
          note: "Pure fast twitch fibers still showing some fatigue",
        },
      },
      systemRecovery: {
        nervous: 80,
        energyStores: 95,
        connectiveTissue: 85,
        hormonal: 90,
      },
      historicalPatterns: {
        averageRecoveryTime: 3.2,
        optimalFrequency: "2x per week",
        variability: "Low (consistent recovery patterns)",
        notes:
          "Recovery is typically complete by day 3, with optimal training windows on days 2-4 after previous session.",
      },
    },
    back: {
      currentRecovery: 65,
      lastTrained: 2,
      recoveryRate: 20,
      fatigue: {
        level: 35,
        description: "Moderate fatigue present. Some soreness and reduced performance capacity.",
      },
      trainingParameters: {
        volume: "Reduced (6-8 sets)",
        intensity: "70-80% of normal",
        rest: "90-120 seconds",
        focus: "Technique/Mind-muscle",
      },
      recoveryFactors: [
        { name: "Sleep Quality", impact: 75 },
        { name: "Nutrition", impact: 80 },
        { name: "Stress Level", impact: 65 },
        { name: "Hydration", impact: 85 },
      ],
      timeline: [
        { day: "Today", recovery: 65, recommendation: "Partial Recovery" },
        { day: "Tomorrow", recovery: 85, recommendation: "Ready for Training" },
        { day: "Day 3", recovery: 95, recommendation: "Optimal Training" },
        { day: "Day 4", recovery: 100, recommendation: "Peak Performance" },
        { day: "Day 5", recovery: 100, recommendation: "Peak Performance" },
        { day: "Day 6", recovery: 95, recommendation: "Optimal Training" },
        { day: "Day 7", recovery: 90, recommendation: "Ready for Training" },
      ],
      optimalWindows: [
        { day: "Today", optimal: false, description: "Suboptimal (65% recovered)" },
        { day: "Tomorrow", optimal: true, description: "Good training window (85% recovered)" },
        { day: "Day 3", optimal: true, description: "Optimal training window (95% recovered)" },
        { day: "Day 4", optimal: true, description: "Peak performance window (100% recovered)" },
        { day: "Day 5", optimal: false, description: "Consider training other muscle groups" },
      ],
      recoveryStrategies: [
        { name: "Foam Rolling", description: "Target lats, rhomboids, and lower back" },
        { name: "Anti-inflammatory Foods", description: "Turmeric, ginger, fatty fish, berries" },
        { name: "Stretching", description: "Dynamic stretching to improve blood flow" },
        { name: "Adequate Hydration", description: "Minimum 3L water daily" },
      ],
      fiberBreakdown: {
        typeI: {
          recovery: 80,
          note: "Slow twitch fibers showing good recovery",
        },
        typeIIa: {
          recovery: 65,
          note: "Intermediate fast twitch fibers still recovering",
        },
        typeIIx: {
          recovery: 50,
          note: "Pure fast twitch fibers showing significant fatigue",
        },
      },
      systemRecovery: {
        nervous: 70,
        energyStores: 85,
        connectiveTissue: 60,
        hormonal: 75,
      },
      historicalPatterns: {
        averageRecoveryTime: 3.8,
        optimalFrequency: "2x per week",
        variability: "Medium (some variation in recovery time)",
        notes:
          "Back typically requires longer recovery than other upper body muscle groups, especially after heavy deadlifts or rows.",
      },
    },
    legs: {
      currentRecovery: 40,
      lastTrained: 1,
      recoveryRate: 30,
      fatigue: {
        level: 60,
        description: "Significant fatigue present. Noticeable soreness and reduced performance capacity.",
      },
      trainingParameters: {
        volume: "Minimal (3-5 sets)",
        intensity: "50-60% of normal",
        rest: "120-180 seconds",
        focus: "Blood flow/Recovery",
      },
      recoveryFactors: [
        { name: "Sleep Quality", impact: 70 },
        { name: "Nutrition", impact: 75 },
        { name: "Stress Level", impact: 60 },
        { name: "Hydration", impact: 80 },
      ],
      timeline: [
        { day: "Today", recovery: 40, recommendation: "Needs Rest" },
        { day: "Tomorrow", recovery: 70, recommendation: "Partial Recovery" },
        { day: "Day 3", recovery: 90, recommendation: "Ready for Training" },
        { day: "Day 4", recovery: 100, recommendation: "Optimal Training" },
        { day: "Day 5", recovery: 100, recommendation: "Peak Performance" },
        { day: "Day 6", recovery: 95, recommendation: "Optimal Training" },
        { day: "Day 7", recovery: 90, recommendation: "Ready for Training" },
      ],
      optimalWindows: [
        { day: "Today", optimal: false, description: "Not recommended (40% recovered)" },
        { day: "Tomorrow", optimal: false, description: "Suboptimal (70% recovered)" },
        { day: "Day 3", optimal: true, description: "Good training window (90% recovered)" },
        { day: "Day 4", optimal: true, description: "Optimal training window (100% recovered)" },
        { day: "Day 5", optimal: true, description: "Peak performance window (100% recovered)" },
      ],
      recoveryStrategies: [
        { name: "Cold Therapy", description: "Ice baths or cold showers to reduce inflammation" },
        { name: "Compression", description: "Compression garments to improve circulation" },
        { name: "Elevation", description: "Elevate legs when resting to reduce swelling" },
        { name: "Light Cardio", description: "5-10 minutes of light cycling to increase blood flow" },
      ],
      fiberBreakdown: {
        typeI: {
          recovery: 60,
          note: "Slow twitch fibers showing moderate recovery",
        },
        typeIIa: {
          recovery: 40,
          note: "Intermediate fast twitch fibers still significantly fatigued",
        },
        typeIIx: {
          recovery: 25,
          note: "Pure fast twitch fibers showing high fatigue levels",
        },
      },
      systemRecovery: {
        nervous: 45,
        energyStores: 65,
        connectiveTissue: 35,
        hormonal: 50,
      },
      historicalPatterns: {
        averageRecoveryTime: 4.5,
        optimalFrequency: "1-2x per week",
        variability: "High (recovery time varies significantly)",
        notes:
          "Leg training typically requires the longest recovery period, especially after heavy squats or deadlifts. Recovery is highly dependent on training intensity and volume.",
      },
    },
    shoulders: {
      currentRecovery: 90,
      lastTrained: 4,
      recoveryRate: 22,
      fatigue: {
        level: 10,
        description: "Minimal fatigue present. Muscle is fully responsive and ready for training.",
      },
      trainingParameters: {
        volume: "Full (10-15 sets)",
        intensity: "95-100% of normal",
        rest: "60-90 seconds",
        focus: "Strength/Power",
      },
      recoveryFactors: [
        { name: "Sleep Quality", impact: 95 },
        { name: "Nutrition", impact: 90 },
        { name: "Stress Level", impact: 85 },
        { name: "Hydration", impact: 90 },
      ],
      timeline: [
        { day: "Today", recovery: 90, recommendation: "Ready for Training" },
        { day: "Tomorrow", recovery: 100, recommendation: "Peak Performance" },
        { day: "Day 3", recovery: 100, recommendation: "Peak Performance" },
        { day: "Day 4", recovery: 95, recommendation: "Optimal Training" },
        { day: "Day 5", recovery: 90, recommendation: "Ready for Training" },
        { day: "Day 6", recovery: 85, recommendation: "Ready for Training" },
        { day: "Day 7", recovery: 80, recommendation: "Ready for Training" },
      ],
      optimalWindows: [
        { day: "Today", optimal: true, description: "Good training window (90% recovered)" },
        { day: "Tomorrow", optimal: true, description: "Optimal training window (100% recovered)" },
        { day: "Day 3", optimal: true, description: "Peak performance window (100% recovered)" },
        { day: "Day 4", optimal: false, description: "Consider training other muscle groups" },
        { day: "Day 5", optimal: false, description: "Consider training other muscle groups" },
      ],
      recoveryStrategies: [
        { name: "Mobility Work", description: "Shoulder dislocates and rotator cuff exercises" },
        { name: "Proper Warm-up", description: "Gradual loading to prepare joints and tendons" },
        { name: "Joint Support", description: "Collagen and vitamin C supplementation" },
        { name: "Technique Focus", description: "Prioritize form over weight to reduce joint stress" },
      ],
      fiberBreakdown: {
        typeI: {
          recovery: 100,
          note: "Slow twitch fibers fully recovered",
        },
        typeIIa: {
          recovery: 95,
          note: "Intermediate fast twitch fibers almost fully recovered",
        },
        typeIIx: {
          recovery: 85,
          note: "Pure fast twitch fibers well recovered",
        },
      },
      systemRecovery: {
        nervous: 90,
        energyStores: 100,
        connectiveTissue: 85,
        hormonal: 95,
      },
      historicalPatterns: {
        averageRecoveryTime: 3.0,
        optimalFrequency: "2-3x per week",
        variability: "Low (consistent recovery patterns)",
        notes:
          "Shoulders typically recover well but are prone to overuse injuries. Focus on quality over quantity and monitor joint health.",
      },
    },
    arms: {
      currentRecovery: 75,
      lastTrained: 2,
      recoveryRate: 35,
      fatigue: {
        level: 25,
        description: "Mild fatigue present. Some minor soreness but good performance capacity.",
      },
      trainingParameters: {
        volume: "Normal (8-12 sets)",
        intensity: "80-90% of normal",
        rest: "60-90 seconds",
        focus: "Hypertrophy/Pump",
      },
      recoveryFactors: [
        { name: "Sleep Quality", impact: 85 },
        { name: "Nutrition", impact: 80 },
        { name: "Stress Level", impact: 75 },
        { name: "Hydration", impact: 90 },
      ],
      timeline: [
        { day: "Today", recovery: 75, recommendation: "Ready for Training" },
        { day: "Tomorrow", recovery: 100, recommendation: "Peak Performance" },
        { day: "Day 3", recovery: 100, recommendation: "Peak Performance" },
        { day: "Day 4", recovery: 95, recommendation: "Optimal Training" },
        { day: "Day 5", recovery: 90, recommendation: "Ready for Training" },
        { day: "Day 6", recovery: 85, recommendation: "Ready for Training" },
        { day: "Day 7", recovery: 80, recommendation: "Ready for Training" },
      ],
      optimalWindows: [
        { day: "Today", optimal: true, description: "Good training window (75% recovered)" },
        { day: "Tomorrow", optimal: true, description: "Optimal training window (100% recovered)" },
        { day: "Day 3", optimal: true, description: "Peak performance window (100% recovered)" },
        { day: "Day 4", optimal: false, description: "Consider training other muscle groups" },
        { day: "Day 5", optimal: false, description: "Consider training other muscle groups" },
      ],
      recoveryStrategies: [
        { name: "Blood Flow Restriction", description: "Light weights with BFR bands to enhance recovery" },
        { name: "Protein Timing", description: "20-25g protein within 1 hour post-workout" },
        { name: "Massage", description: "Self-massage or foam rolling to reduce soreness" },
        { name: "Isometric Holds", description: "Light isometric contractions to increase blood flow" },
      ],
      fiberBreakdown: {
        typeI: {
          recovery: 90,
          note: "Slow twitch fibers almost fully recovered",
        },
        typeIIa: {
          recovery: 75,
          note: "Intermediate fast twitch fibers showing good recovery",
        },
        typeIIx: {
          recovery: 65,
          note: "Pure fast twitch fibers still recovering",
        },
      },
      systemRecovery: {
        nervous: 80,
        energyStores: 90,
        connectiveTissue: 70,
        hormonal: 85,
      },
      historicalPatterns: {
        averageRecoveryTime: 2.5,
        optimalFrequency: "2-3x per week",
        variability: "Low (consistent recovery patterns)",
        notes:
          "Arms typically recover quickly and can handle higher frequency training. Biceps tend to recover faster than triceps.",
      },
    },
  }
  
  // Rep range analysis data
  export const repRangeData = {
    strength: [
      { range: "1-3 reps", yourPercentage: 15, optimalPercentage: 40, effectiveness: 90 },
      { range: "4-6 reps", yourPercentage: 30, optimalPercentage: 40, effectiveness: 95 },
      { range: "7-9 reps", yourPercentage: 35, optimalPercentage: 15, effectiveness: 70 },
      { range: "10-12 reps", yourPercentage: 15, optimalPercentage: 5, effectiveness: 50 },
      { range: "13+ reps", yourPercentage: 5, optimalPercentage: 0, effectiveness: 30 },
    ],
    hypertrophy: [
      { range: "1-3 reps", yourPercentage: 15, optimalPercentage: 5, effectiveness: 40 },
      { range: "4-6 reps", yourPercentage: 30, optimalPercentage: 15, effectiveness: 70 },
      { range: "7-9 reps", yourPercentage: 35, optimalPercentage: 30, effectiveness: 85 },
      { range: "10-12 reps", yourPercentage: 15, optimalPercentage: 40, effectiveness: 95 },
      { range: "13+ reps", yourPercentage: 5, optimalPercentage: 10, effectiveness: 75 },
    ],
    endurance: [
      { range: "1-3 reps", yourPercentage: 15, optimalPercentage: 0, effectiveness: 10 },
      { range: "4-6 reps", yourPercentage: 30, optimalPercentage: 5, effectiveness: 30 },
      { range: "7-9 reps", yourPercentage: 35, optimalPercentage: 15, effectiveness: 50 },
      { range: "10-12 reps", yourPercentage: 15, optimalPercentage: 30, effectiveness: 75 },
      { range: "13+ reps", yourPercentage: 5, optimalPercentage: 50, effectiveness: 95 },
    ],
    power: [
      { range: "1-3 reps", yourPercentage: 15, optimalPercentage: 60, effectiveness: 95 },
      { range: "4-6 reps", yourPercentage: 30, optimalPercentage: 30, effectiveness: 80 },
      { range: "7-9 reps", yourPercentage: 35, optimalPercentage: 10, effectiveness: 40 },
      { range: "10-12 reps", yourPercentage: 15, optimalPercentage: 0, effectiveness: 20 },
      { range: "13+ reps", yourPercentage: 5, optimalPercentage: 0, effectiveness: 10 },
    ],
  }
  
  