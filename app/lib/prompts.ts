/**
 * Centralized prompt templates for AI-powered image comparison.
 * Each checkpoint has detailed, item-specific criteria for GPT-4o Vision.
 *
 * Edit the criteria below to fine-tune what the AI checks for each item.
 */

// ---------------------------------------------------------------------------
// Per-checkpoint detailed comparison criteria
// ---------------------------------------------------------------------------

export const checkpointCriteria: Record<string, string> = {

  // 1. Dustbin
  "Dustbin": `
MUST CHECK:
- Dustbin is completely EMPTY with no visible trash or debris inside.
- A FRESH plastic liner is placed inside the bin, edges neatly tucked over the rim.
- Dustbin is positioned to the LEFT side of the desk.
- The exterior of the bin is clean, free of stains, fingerprints, or smudges.
- The lid (if present) is closed and functioning properly.
FAIL IF: Any trash visible inside, no liner present, wrong position, or visibly dirty exterior.
  `,

  // 2. Bed & Pillows
  // 2. Bed & Pillows
  "Bed & Pillows": `
MUST CHECK:
- Bed is fully made, crisp, and neatly tucked.
- Exactly 4 standard white pillows arranged standing upright against the headboard in two rows (2 in the back row, 2 in the front row).
- Exactly 1 small rectangular decorative accent pillow (red border, embroidered center) placed centrally in front of the white pillows.
- All white pillowcases are crisp and wrinkle-free.
- Red and gold patterned bed runner is placed at the foot of the bed, CENTRED horizontally.
- Bed runner hangs evenly on both sides.
- No prominent creases, wrinkles, or bunching on the white bed linens.
FAIL IF: Missing or incorrect number of white pillows, missing decorative accent pillow, pillows arranged flat instead of upright, bed runner off-centre or missing, visible wrinkles on the bed.
  `,

  // 3. Bed Linen
  "Bed Linen": `
MUST CHECK:
- Sheets are CRISP WHITE with no stains, discolouration, or hair.
- Hospital corners are properly tucked on all four corners of the bed.
- Top sheet is folded back evenly at the head of the bed.
- No wrinkles, creases, or lumps visible on the surface.
- Mattress pad/protector is not visible from any angle.
- Duvet/comforter sits flat and even from side to side.
FAIL IF: Stains present, hospital corners not done, visible wrinkles, sheets not white, mattress pad showing.
  `,

  // 4. Towels (Bathroom)
  "Towels (Bathroom)": `
MUST CHECK:
- Exactly 2 BATH TOWELS fan-folded and placed on the towel rack.
- Exactly 2 HAND TOWELS hung on the towel ring.
- Exactly 1 BATH MAT laid flat on the floor in front of the shower/tub.
- All towels are WHITE, clean, and free of stains or marks.
- Towels are evenly folded/hung with no loose edges.
- Bath mat is flat with no curled corners.
FAIL IF: Wrong count of any towel type, towels not properly folded/hung, stains visible, bath mat bunched up.
  `,

  // 5. Towels (Bedroom)
  "Towels (Bedroom)": `
MUST CHECK:
- Exactly 1 FOLDED BATHROBE placed at the foot of the bed, neatly folded.
- Bathrobe belt/sash is neatly tucked or tied.
- Other plain, clean, white folded towels are neatly arranged on the bed (e.g., beneath the robe).
- NO TOWEL SWAN or other creative towel art decoration is present on the bed.
- All items are clean, white, and stain-free.
FAIL IF: Bathrobe missing, robe poorly folded or has poor logo/text definition, stains present, or ANY towel swan decoration is present on the bed.
  `,
  // 6. Coffee/Tea Tray
  "Coffee/Tea Tray": `
MUST CHECK:
- KETTLE is present on the tray and positioned upright.
- Exactly 2 CUPS placed on their SAUCERS.
- Exactly 4 TEA BAGS (variety or same type, individually packed).
- Exactly 4 COFFEE SACHETS (individually packed).
- Exactly 4 SUGAR packets (white or brown).
- Exactly 2 MILK PODS / creamers.
- All items are neatly arranged on the tray, not scattered.
- Tray is clean with no spills or residue.
- Cups and saucers have no chips or cracks.
FAIL IF: Any item missing or wrong count, messy arrangement, dirty tray, chipped cups.
  `,

  // 7. Minibar / Water Bottles
  "Minibar / Water Bottles": `
MUST CHECK:
- Exactly 2 BISLERI 500ml water bottles placed on the tray.
- Exactly 1 COCA-COLA bottle/can present.
- Exactly 1 SPRITE bottle/can present.
- All bottles are sealed and unopened.
- Labels are facing forward and visible.
- Items are arranged neatly on the tray/shelf.
- No expired products (check visible dates if readable).
FAIL IF: Wrong count of any beverage, bottles opened/tampered, labels not facing forward, arrangement messy.
  `,

  // 8. Bathroom Amenities
  "Bathroom Amenities": `
MUST CHECK:
- Exactly 2 WRAPPED SOAPS (sealed in packaging).
- Exactly 1 SHAMPOO bottle/sachet.
- Exactly 1 CONDITIONER bottle/sachet.
- Exactly 1 BODY LOTION bottle/sachet.
- Exactly 2 DENTAL KITS (toothbrush + toothpaste packs).
- All items arranged in an ARC/curved pattern on the counter.
- All packaging is intact and unopened.
- Counter/surface is clean and dry.
FAIL IF: Any item missing or wrong count, items not in arc arrangement, opened packaging, dirty surface.
  `,

  // 9. TV Remote & Menu Card
  "TV Remote & Menu Card": `
MUST CHECK:
- TV REMOTE is placed at approximately 45° angle on the nightstand.
- Remote is clean with no smudges and batteries are inside (no battery cover gap).
- MENU CARD is propped upright against the lamp base.
- Menu card is clean, not bent, folded, or dog-eared.
- Both items are on the same nightstand/bedside table.
- Nightstand surface is clean and free of dust.
FAIL IF: Remote not at 45° angle, menu card not propped against lamp, items on wrong table, dirty/damaged items.
  `,

  // 10. Curtains & Lighting
  "Curtains & Lighting": `
MUST CHECK:
- BOTH main curtains are TIED BACK symmetrically (matching tie-back height on each side).
- SHEER/net curtains are DRAWN closed (covering the window evenly).
- BOTH bedside lamps are turned ON (warm light visible).
- Curtain fabric hangs smoothly with no bunching or tangling.
- Tie-backs are at matching heights on both sides.
- No gaps or uneven sections in the sheer curtains.
FAIL IF: Curtains not tied back, asymmetric tie-backs, sheer curtains not drawn, any lamp OFF, fabric bunched.
  `,

  // 11. Wardrobe/Closet
  "Wardrobe/Closet": `
MUST CHECK:
- Exactly 6 HANGERS evenly spaced on the rail (consistent gaps between each).
- Exactly 1 LAUNDRY BAG hanging or placed inside the wardrobe.
- Exactly 1 SHOE MITT/shoe polish kit present.
- IRON is present and placed safely (upright or on holder).
- IRONING BOARD is present (folded or mounted).
- Interior of wardrobe is clean, no dust or debris on shelves/floor.
- Hangers are all the same type and colour.
FAIL IF: Wrong hanger count or uneven spacing, missing laundry bag/shoe mitt/iron/ironing board, dirty interior.
  `,

  // 12. Welcome Items & Stationery
  "Welcome Items & Stationery": `
MUST CHECK:
- WELCOME CARD is placed CENTRED on the desk surface.
- PEN is placed ON TOP of the notepad (not beside it).
- NOTEPAD is present and aligned straight on the desk.
- WI-FI CARD is placed BESIDE the telephone.
- Welcome card is upright/visible and not damaged.
- All stationery items are branded/matching hotel standards.
- Desk surface is clean and uncluttered.
FAIL IF: Welcome card not centred, pen not on notepad, Wi-Fi card not beside phone, items damaged or missing.
  `,
};


// ---------------------------------------------------------------------------
// System-level instruction for the comparison model
// ---------------------------------------------------------------------------

const SYSTEM_INSTRUCTION = `You are a luxury hotel room inspector AI. You compare an 'Inspection Image' (photo taken by housekeeping staff) against a 'Master Image' (the gold-standard reference).

Your job is to detect ANY discrepancy, no matter how small. Hotels maintain a zero-tolerance policy for deviations from the master setup.

RULES:
1. Compare ITEM PRESENCE — every required item must be visible.
2. Compare ITEM COUNT — exact quantities must match.
3. Compare CLEANLINESS — no stains, smudges, dust, or debris.
4. Compare POSITIONING — items must be in the correct location and orientation.
5. Compare CONDITION — no damage, tears, wrinkles, or wear.
6. Be STRICT — when in doubt, FAIL. It is better to flag a marginal issue than to miss one.

RESPONSE FORMAT (JSON only, no markdown):
{"status": "pass" | "fail", "reason": "concise 1-2 sentence explanation"}`;


// ---------------------------------------------------------------------------
// Prompt generator
// ---------------------------------------------------------------------------

/**
 * Generates the full comparison prompt for a given checkpoint.
 * Uses checkpoint-specific criteria if available, otherwise falls back to
 * the generic reference description.
 *
 * @param checkpointName - Name of the checkpoint (e.g. "Dustbin")
 * @param inspectionCriteria - Fallback reference description
 * @returns The complete prompt string for GPT-4o vision comparison
 */
export function getComparisonPrompt(checkpointName: string, inspectionCriteria: string): string {
  const detailedCriteria = checkpointCriteria[checkpointName] || inspectionCriteria;

  return `${SYSTEM_INSTRUCTION}

---

CHECKPOINT: "${checkpointName}"

DETAILED CRITERIA:
${detailedCriteria.trim()}

FALLBACK REFERENCE: ${inspectionCriteria}

---

Compare the two images below. The first is the INSPECTION image (taken by staff). The second is the MASTER image (perfect reference).

Return JSON only: {"status": "pass" | "fail", "reason": "short explanation"}`;
}
