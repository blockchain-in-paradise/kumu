// Named poses for the 3D rig (see rig3d.js for the angle conventions). Keys a pose leaves out are 0.
// head tilts the head on the neck (negative snaps it back). reachF / reachB aim that glove at the
// opponent's chin (see SportsRig.face); hookF/B, upF/B and overF/B bring that reach in on an arc (see the bent punches).
// Add a pose by copying the closest one and changing a few joints. F is the lead side, B the rear.
window.SportsPoses = {
  // Orthodox stance, bladed with the lead side forward, hands up.
  guard:    { torso: 6,   hipYaw: 12, chestYaw: 10,  armF: -38, foreF: -122, abdF: 10, armB: -22, foreB: -148, abdB: 14,
              legF: -22, shinF: 20, legB: 24, shinB: 8, legAbdF: 4, legAbdB: 6 },
  // Lead hand straight out, lead shoulder turned in.
  jab:      { reachF: 1, torso: 12,  hipYaw: 25, chestYaw: 32,  armF: -100, foreF: -4,  abdF: 4,  armB: -22, foreB: -150, abdB: 14,
              legF: -28, shinF: 22, legB: 28, shinB: 6, legAbdF: 4, legAbdB: 6 },
  // Wind-up for the rear hand: weight sinks, the lead side opens.
  load:     { torso: 10,  hipYaw: 28, chestYaw: 26,  armF: -40, foreF: -118, abdF: 12, armB: -26, foreB: -140, abdB: 18,
              legF: -20, shinF: 26, legB: 26, shinB: 16, legAbdF: 4, legAbdB: 6 },
  // Rear hand straight out, hips and shoulders turned through.
  straight: { reachB: 1, torso: 16,  hipYaw: -12, chestYaw: -34, armF: -48, foreF: -122, abdF: 14, armB: -112, foreB: -2, abdB: 0,
              legF: -26, shinF: 24, legB: 34, shinB: 2, legAbdF: 4, legAbdB: 6 },
  // Weight sinks onto the bent rear leg, hips go back, the back arches away, the chin stays tucked.
  lean:     { torso: -30, hipYaw: 10, chestYaw: 2, roll: 4, head: 12, armF: -34, foreF: -128, abdF: 10, armB: -20, foreB: -150, abdB: 14,
              legF: -10, shinF: 4, legB: 30, shinB: 34, legAbdF: 4, legAbdB: 6 },
  // Small slip outside the jab: knees bend, waist turns, the head sidesteps (z) with both hands still in guard
  // and the weight on the rear foot. z is a sidestep that stays until another pose or tween sets z again
  // (guard does not reset it): tween z back to 0 when the fighter returns to the line.
  slip:     { torso: 10, roll: -14, hipYaw: -8, chestYaw: -24, head: 2, armF: -40, foreF: -124, abdF: 10, armB: -22, foreB: -148, abdB: 14, z: -70,
              legF: -20, shinF: 22, legB: 30, shinB: 14, legAbdF: 4, legAbdB: 6 },
  // The slip in stages, for words that name each move: knees bend first, then the waist turns, then the head
  // sidesteps (slip).
  slipBend: { torso: 8, hipYaw: 12, chestYaw: 10, armF: -38, foreF: -122, abdF: 10, armB: -22, foreB: -148, abdB: 14,
              legF: -22, shinF: 30, legB: 30, shinB: 16, legAbdF: 4, legAbdB: 6 },
  slipTurn: { torso: 10, roll: -6, hipYaw: -4, chestYaw: -14, head: 2, armF: -40, foreF: -124, abdF: 10, armB: -22, foreB: -148, abdB: 14,
              legF: -20, shinF: 22, legB: 30, shinB: 14, legAbdF: 4, legAbdB: 6 },
  // The same slip to the other side (inside the jab, toward the opponent's rear hand).
  slipInside: { torso: 10, roll: 14, hipYaw: 14, chestYaw: 18, head: -2, armF: -40, foreF: -124, abdF: 10, armB: -22, foreB: -148, abdB: 14, z: 55,
                legF: -20, shinF: 22, legB: 30, shinB: 14, legAbdF: 4, legAbdB: 6 },
  // Slip, then the rear hand returns straight onto the chin.
  slipCounter: { reachB: 1, torso: 10, roll: -14, hipYaw: -8, chestYaw: -24, head: 2, armF: -40, foreF: -124, abdF: 10, armB: -112, foreB: -2, abdB: 0, z: -70,
                 legF: -20, shinF: 22, legB: 30, shinB: 14, legAbdF: 4, legAbdB: 6 },
  // Bob: the knees bend deep and the torso folds forward so the head drops about 70 units under a punch, both
  // feet planted and the guard still up. Pair it with a punch aimed at your standing head so it passes over.
  bob:      { torso: 18, hipYaw: 12, chestYaw: 10, armF: -42, foreF: -124, abdF: 10, armB: -26, foreB: -148, abdB: 14,
              legF: -48, shinF: 76, legB: 24, shinB: 26, legAbdF: 4, legAbdB: 6 },
  // Weave: the bob carried sideways in the U, the head still low and now past the punch (z sidesteps, roll tilts).
  weave:    { torso: 18, roll: -22, hipYaw: -6, chestYaw: -22, head: 4, armF: -42, foreF: -124, abdF: 10, armB: -26, foreB: -148, abdB: 14, z: -60,
              legF: -48, shinF: 76, legB: 24, shinB: 26, legAbdF: 4, legAbdB: 6 },
  // Weave to the other side (mirror of weave): z +60, roll +22.
  weaveR:   { torso: 18, roll: 22, hipYaw: 30, chestYaw: 42, head: -4, armF: -42, foreF: -124, abdF: 10, armB: -26, foreB: -148, abdB: 14, z: 60,
              legF: -48, shinF: 76, legB: 24, shinB: 26, legAbdF: 4, legAbdB: 6 },
  // Hit in the middle of a weave: the same low, sidestepped stance with the head snapped back and the guard knocked open.
  weaveHit: { torso: 8, roll: -26, hipYaw: -6, chestYaw: -22, head: -26, armF: -22, foreF: -102, abdF: 30, armB: -14, foreB: -122, abdB: 28, z: -60,
              legF: -48, shinF: 76, legB: 24, shinB: 26, legAbdF: 4, legAbdB: 6 },
  // Snapped back and twisted by a punch: the head whips back on the neck.
  hit:      { torso: -6,  roll: -8, head: -28, hipYaw: 10, chestYaw: 28, armF: -8, foreF: -70, abdF: 26, armB: -4, foreB: -96, abdB: 28,
              legF: -18, shinF: 14, legB: 26, shinB: 12, legAbdF: 4, legAbdB: 6 },
  // Lead foot steps forward.
  step:     { torso: 8,   hipYaw: 20, chestYaw: 15,  armF: -38, foreF: -122, abdF: 10, armB: -22, foreB: -148, abdB: 14,
              legF: -38, shinF: 30, legB: 22, shinB: 10, legAbdF: 4, legAbdB: 6 },
  // Bent punches: the rig brings the glove in on an arc (hook*, up*, over* = 1). Each has a load pose that coils the
  // body the opposite way first, so the turn into the punch shows which hand is coming. Throw the load ~0.25 s,
  // then the punch over ~0.18 s.
  // Lead hook load: weight dips onto the lead hip, shoulders turn toward the lead side (lead shoulder back).
  hookLoad: { torso: 10, roll: 10, hipYaw: 6, chestYaw: -6, armF: -40, foreF: -116, abdF: 30, armB: -22, foreB: -148, abdB: 14,
              legF: -26, shinF: 32, legB: 24, shinB: 10, legAbdF: 4, legAbdB: 6 },
  // Lead hook: hips and shoulders whip through so the lead shoulder comes around, elbow up and out at glove height.
  hook:     { reachF: 1, hookF: 1, torso: 10, roll: -4, hipYaw: 30, chestYaw: 44, armF: -40, foreF: -95, abdF: 82, armB: -22, foreB: -148, abdB: 14,
              legF: -24, shinF: 24, legB: 30, shinB: 6, legAbdF: 4, legAbdB: 6 },
  // Rear hook load: weight on the rear hip, lead side turned forward.
  rearHookLoad: { torso: 10, roll: -8, hipYaw: 26, chestYaw: 30, armF: -40, foreF: -120, abdF: 12, armB: -26, foreB: -140, abdB: 30,
                  legF: -20, shinF: 24, legB: 28, shinB: 18, legAbdF: 4, legAbdB: 6 },
  // Rear hook: the rear shoulder comes around, elbow up and out.
  rearHook: { reachB: 1, hookB: 1, torso: 12, roll: 6, hipYaw: -14, chestYaw: -40, armF: -40, foreF: -122, abdF: 14, armB: -40, foreB: -95, abdB: 82,
              legF: -26, shinF: 26, legB: 32, shinB: 4, legAbdF: 4, legAbdB: 6 },
  // Rear uppercut load: knees sink, weight dips onto the rear side, the rear glove drops to the chest.
  upLoad:   { torso: 20, roll: -12, hipYaw: 22, chestYaw: 24, armF: -40, foreF: -124, abdF: 10, armB: -8, foreB: -126, abdB: 10,
              legF: -36, shinF: 50, legB: 32, shinB: 30, legAbdF: 4, legAbdB: 6 },
  // Rear uppercut: legs drive up, the rear hip turns through, the glove rises under the chin, elbow below it.
  uppercut: { reachB: 1, upB: 1, torso: 4, roll: 6, hipYaw: -14, chestYaw: -30, armF: -40, foreF: -122, abdF: 14, armB: -40, foreB: -100, abdB: 6,
              legF: -24, shinF: 22, legB: 30, shinB: 6, legAbdF: 4, legAbdB: 6 },
  // Lead uppercut load: knees sink, weight dips onto the lead side, the lead glove drops.
  leadUpLoad: { torso: 18, roll: 12, hipYaw: 4, chestYaw: -4, armF: -10, foreF: -126, abdF: 8, armB: -22, foreB: -148, abdB: 14,
                legF: -38, shinF: 52, legB: 28, shinB: 24, legAbdF: 4, legAbdB: 6 },
  // Lead uppercut: the lead hip drives up and around, the glove rises under the chin.
  leadUppercut: { reachF: 1, upF: 1, torso: 4, roll: -6, hipYaw: 26, chestYaw: 34, armF: -40, foreF: -100, abdF: 6, armB: -22, foreB: -148, abdB: 14,
                  legF: -24, shinF: 22, legB: 30, shinB: 6, legAbdF: 4, legAbdB: 6 },
  // Overhand load: lead side turned forward, the rear elbow lifts.
  overLoad: { torso: 6, roll: -6, hipYaw: 26, chestYaw: 30, armF: -40, foreF: -120, abdF: 12, armB: -30, foreB: -130, abdB: 40,
              legF: -20, shinF: 24, legB: 28, shinB: 16, legAbdF: 4, legAbdB: 6 },
  // Overhand: the rear hand loops over the top and down onto the chin as the body pitches forward over the lead
  // leg and the head drops off the line to the lead side.
  overhand: { reachB: 1, overB: 1, torso: 26, roll: 14, hipYaw: -16, chestYaw: -42, armF: -40, foreF: -122, abdF: 14, armB: -130, foreB: -40, abdB: 40,
              legF: -34, shinF: 34, legB: 34, shinB: 2, legAbdF: 4, legAbdB: 6 },
};
