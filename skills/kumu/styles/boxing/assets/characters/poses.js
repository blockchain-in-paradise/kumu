// Named poses for the side-view fighter (see fighter.js for the angle convention).
// Add a pose by copying the closest one and changing a few joints; keep every key.
window.SportsPoses = {
  // Orthodox stance, hands up.
  guard:    { torso: 6,   armF: -38, foreF: -122, armB: -22, foreB: -148, legF: -22, shinF: 20, legB: 24, shinB: 8 },
  // Lead hand straight out.
  jab:      { torso: 12,  armF: -125, foreF: 0,   armB: -22, foreB: -150, legF: -28, shinF: 22, legB: 28, shinB: 6 },
  // Rear hand straight out, hips turned in.
  straight: { torso: 18,  armF: -30, foreF: -132, armB: -133, foreB: 0,   legF: -26, shinF: 24, legB: 34, shinB: 2 },
  // Weight on the back foot, head pulled out of range.
  lean:     { torso: -26, armF: -30, foreF: -128, armB: -12, foreB: -152, legF: -12, shinF: 8, legB: 32, shinB: 20 },
  // Snapped back by a punch.
  hit:      { torso: -12, armF: -20, foreF: -110, armB: -8,  foreB: -140, legF: -18, shinF: 14, legB: 26, shinB: 12 },
  // Lead foot steps forward.
  step:     { torso: 8,   armF: -38, foreF: -122, armB: -22, foreB: -148, legF: -38, shinF: 30, legB: 22, shinB: 10 },
};
