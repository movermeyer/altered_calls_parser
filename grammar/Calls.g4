grammar Calls;

// ======
// Assumptions and differences from the rulebook (v3.2)
//
// * "A weapon can only have two Damage Types" (_§Damage Type Limit_)
//   * This doesn't preclude other damage calls (Spells, etc.) from having more.
//   * We've limited the grammar to only support two Damage Types
// * "A damage call can only have one effect added to it. Some item tags allow
//   you to make a damage call with multiple effects attached to it." (_§Effect Limit_)
//   * The rulebook doesn't define what the structure of that call would look like
//   * We've limited the grammar to only support a single Effect (except for
//     "Overwhelm", which is technically an Effect)
// * The rulebook does not provide a definitive list of all elemental damage types
// * The rulebook list "Radiation" as an elemental damage type (_§8.3: Damage Types_)
//   * We've extended the grammar to also accept "Rad", which is the term used in-game
// * Power Word and Power Light are not Damage Calls
//   * They're their own kind of call, which delivers an effect without dealing
//     damage, so they're out of scope for this grammar
// * The rulebook doesn't mention the ability to Drain Armour as a resource
//   * We extended the Drain Damage Type syntax to support Armour as a valid resource.
//
// ======

// ============================================================
// Parser rules
// ============================================================

damageCall
    : (fullAuto | effect? number?) damageType? damageType? EOF
    ;

// "Full Auto" is an effect like any other in the rulebook, but its call form is
// "Full Auto [item damage]", so unlike every other effect it must state a
// number. It therefore sits beside `effect` rather than inside it, and carries
// the number it requires. Keeping that number here rather than writing
// `fullAuto number` in damageCall also leaves damageCall's own `number`
// reference singular, so the generated context keeps its `number()` accessor.
// "Overwhelm" can still prefix it, and must come first when it does.
fullAuto
    : OVERWHELM? FULL AUTO number
    ;

// "Overwhelm" modifies the effect keyword itself, so it lives inside this rule
// rather than beside it in damageCall. The optional
// keyword sits outside the alternation group -- writing
// `OVERWHELM? BREAK | CHARM | ...` instead would bind OVERWHELM to only the
// first alternative.
effect
    : OVERWHELM? (BREAK | CHARM | COMMAND | DAZE | DEATH | DISARM | FEAR
    | KNOCKDOWN | KNOCKOUT | MAIM | PIN | RAGE | SLAM | SLAY | STUN)
    ;

number
    : NUMBER
    ;

// FLESH/STAMINA/FOCUS are reused between the bare damage-type alternatives
// and `resource` (inside drainDamageType). This isn't a real ambiguity --
// ANTLR's ALL(*) lookahead resolves it by checking whether a DRAIN token
// follows -- so no special-casing is required here.
damageType
    : drainDamageType
    | FLESH | HEAL | REPAIR | FOCUS | STAMINA
    | elemental
    ;

drainDamageType
    : number resource DRAIN
    ;

resource
    : FLESH | STAMINA | FOCUS | ARMOUR
    ;

elemental
    : AURIC | DARK | DEEP | FAE | FIRE | ICE | LIGHT | POISON | RAD | RADIATION
    ;

// ============================================================
// Lexer rules
// ============================================================
// All keyword literals are written uppercase and matched against an
// upper-cased view of the input (see CaseChangingCharStream in each host
// language's entry point) -- NOT via case-fragment rules -- so the
// grammar itself stays simple and mirrors the BNF as given. Keyword rules
// must precede IDENT: on a maximal-munch length tie ANTLR picks the
// first-declared rule, so e.g. the literal "STUN" always tokenizes as the
// STUN keyword and not as a generic IDENT.

OVERWHELM : 'OVERWHELM';
FULL      : 'FULL';
AUTO      : 'AUTO';

BREAK     : 'BREAK';
CHARM     : 'CHARM';
COMMAND   : 'COMMAND';
DAZE      : 'DAZE';
DEATH     : 'DEATH';
DISARM    : 'DISARM';
FEAR      : 'FEAR';
KNOCKDOWN : 'KNOCKDOWN';
KNOCKOUT  : 'KNOCKOUT';
MAIM      : 'MAIM';
PIN       : 'PIN';
RAGE      : 'RAGE';
SLAM      : 'SLAM';
SLAY      : 'SLAY';
STUN      : 'STUN';

FLESH     : 'FLESH';
HEAL      : 'HEAL';
REPAIR    : 'REPAIR';
FOCUS     : 'FOCUS';
STAMINA   : 'STAMINA';

FIRE      : 'FIRE';
DARK      : 'DARK';
LIGHT     : 'LIGHT';
POISON    : 'POISON';
// RAD and RADIATION are separate keywords rather than spellings of one
// token: maximal munch means "RADIATION" matches RADIATION rather than
// leaving "IATION" behind, and each keeps its own canonical word, so a call
// normalizes back to whichever term was actually shouted.
RAD       : 'RAD';
RADIATION : 'RADIATION';
AURIC     : 'AURIC';
FAE       : 'FAE';
DEEP      : 'DEEP';
ICE       : 'ICE';

DRAIN     : 'DRAIN';
ARMOUR    : 'ARMOUR';

NUMBER    : [0-9]+;

// Hyphens and whitespace are both valid separators between words, and
// runs of either collapse to a single separator -- this alone makes
// already-hyphenated canonical text (e.g. "knockdown-5-fire") parse
// identically to space-separated input.
SEP       : [ \t\r\n\-]+ -> skip;

// Any other run of letters becomes an opaque token instead of a raw
// lexer error, turning unrecognized words into ordinary parser syntax
// errors (with position/text) rather than lexer-level failures, and
// giving the completion engines a real token to anchor a partial word to.
IDENT     : [A-Za-z]+;
