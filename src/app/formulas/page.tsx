import { Card } from "@/components/ui/Card";

export default function FormulasPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-osrs-gold mb-2" style={{ fontFamily: "var(--font-runescape)" }}>
        DPS Formulas
      </h1>
      <p className="text-osrs-text-dim mb-8">
        Every formula used in the calculator, in order of application. Based on the{" "}
        <a href="https://oldschool.runescape.wiki/w/Damage_per_second/Melee" target="_blank" rel="noopener noreferrer" className="text-osrs-gold hover:underline">OSRS Wiki</a>{" "}
        DPS documentation.
      </p>

      <div className="space-y-6">
        <FormulaSection title="1. Effective Level">
          <Formula code={`// Wiki order: base → potion (additive) → prayer (floor) → style + 8 → void (floor)
effectiveLevel = FLOOR(FLOOR((baseLvl + potionBoost) × prayerMult) + styleBonus + 8) × voidMult)`} />
          <Note>
            <strong>Potion boosts</strong> (additive): Super Combat = 5 + FLOOR(lvl × 0.15); Ranging = 4 + FLOOR(lvl × 0.10); Magic = 4 + FLOOR(lvl × 0.10); Overload = 5 + FLOOR(lvl × 0.15); Smelling Salts = 11 + FLOOR(lvl × 0.16).
          </Note>
          <Note>
            <strong>Prayer multipliers (str)</strong>: Piety = 1.23; Chivalry = 1.18; Ult Str = 1.15; Rigour = 1.23; Eagle Eye = 1.15.
          </Note>
          <Note>
            <strong>Prayer multipliers (atk)</strong>: Piety = 1.20; Chivalry = 1.15; Rigour = 1.20; Augury = 1.25.
          </Note>
          <Note>
            <strong>Style bonus (str)</strong>: Aggressive = +3; Controlled = +1; others = +0.
          </Note>
          <Note>
            <strong>Style bonus (atk)</strong>: Accurate = +3; Controlled = +1; others = +0.
          </Note>
          <Note>
            <strong>Void multipliers (str)</strong>: Melee void = 1.10; Ranged void = 1.10, Elite ranged = 1.125; Mage void = 1.00, Elite mage = 1.025.
          </Note>
        </FormulaSection>

        <FormulaSection title="2. Equipment Strength">
          <Formula code="equipStr = SUM(gear[slot].mstr)  // or .rstr for ranged, .mdmg for magic" />
          <Note>
            <strong>Pact G6</strong>: +FLOOR(STR_level × 0.20) added to melee strength.
          </Note>
          <Note>
            <strong>Pact G7</strong>: +FLOOR(Prayer_level × 0.50) added to melee strength.
          </Note>
        </FormulaSection>

        <FormulaSection title="3. Base Max Hit">
          <Formula code={`// Melee & Ranged:
maxHit = FLOOR(0.5 + effLvl × (equipStr + 64) / 640)

// Powered Staff — each has unique base damage using visible magic level:
//   Shadow:         FLOOR(magic / 3) + 1
//   Sang / Lithic:  FLOOR(magic / 3) - 1
//   Trident Swamp:  FLOOR(magic / 3) - 2
//   Trident Seas:   FLOOR(magic / 3) - 5
// Then: maxHit = FLOOR(baseDmg × (1 + mdmg% / 100))

// Standard Spells (e.g. Fire Surge base = 24):
maxHit = FLOOR(spellBase × (1 + mdmg% / 100))`} />
          <Note>
            <strong>Shadow passive</strong>: Triples ALL equipment magic attack + magic damage % before calculation. Magic damage capped at 100%.
          </Note>
        </FormulaSection>

        <FormulaSection title="4. Multiplier Chain">
          <Note>Applied in order, each FLOOR&apos;d after multiplication:</Note>
          <ol className="list-decimal list-inside text-sm text-osrs-text-dim space-y-1 ml-2">
            <li><strong>Slayer Helm (i) / V&apos;s Helm</strong>: Melee ×7/6 (16.67%), Ranged/Magic ×1.15 (15%), on task only</li>
            <li><strong>Style Pacts</strong> (GA/HA/FA): ×1.01</li>
            <li><strong>Crossbow Mastery</strong> (K8): ×1.70</li>
            <li><strong>Halberd Distance</strong> (J4): ×(1 + 0.04 × FLOOR(dist/3))</li>
            <li><strong>Twisted Bow</strong>: ×MIN(250, MAX(0, 250 + FLOOR(3M/10) - FLOOR(M/200) - 100)) / 100</li>
            <li><strong>Shadowflame Quadrant</strong>: ×1.40</li>
            <li><strong>Osmumten&apos;s Fang</strong>: ×0.85 (reduced max hit, compensated by double roll + min hit)</li>
            <li><strong>Arclight vs Demons</strong>: ×1.70</li>
            <li><strong>Devil&apos;s Element</strong>: ×1.30 (elemental weakness)</li>
          </ol>
          <Note>
            <strong>Note</strong>: Void Knight bonus (1.10/1.125) is applied inside the effective level, not as a chain multiplier.
          </Note>
          <Note>
            <strong>Shadow 3x</strong> is applied to equipment magic dmg% before max hit calc (not as a chain multiplier).
          </Note>
          <Note>
            <strong>Flat modifiers after chain</strong>: H4 = +5 melee str; F8 = -8 powered staff max hit.
          </Note>
        </FormulaSection>

        <FormulaSection title="5. Attack Roll">
          <Formula code={`attackRoll = (effAtkLvl + 8) × (equipAtk + 64) × (1 + pactAcc% / 100)

// Pact accuracy: CA = +15%, F1 = +35%, H1 = 5% + 5%/tile`} />
          <Note>
            Void accuracy: ×1.10 applied to roll. Slayer helm: ×7/6 applied to roll.
          </Note>
          <Note>
            <strong>TBow accuracy scaling</strong>: ×MIN(140, MAX(0, 140 + FLOOR(3M/10) - FLOOR(M/200) - 10)) / 100
          </Note>
        </FormulaSection>

        <FormulaSection title="6. Defence Roll">
          <Formula code={`// Melee/Ranged:
defRoll = (defLevel + 9) × (defBonus + 64)

// Magic attacks: use target's magicLevel instead of defLevel
defRoll = (magicLevel + 9) × (magicDefBonus + 64)`} />
        </FormulaSection>

        <FormulaSection title="7. Accuracy">
          <Formula code={`if (atkRoll > defRoll):
  accuracy = 1 - (defRoll + 2) / (2 × (atkRoll + 1))
else:
  accuracy = atkRoll / (2 × (defRoll + 1))`} />
          <Note>
            <strong>Double accuracy roll</strong> (N7 crossbow, Drygore): accuracy = 1 - (1 - acc)&sup2;<br />
            <strong>Fang exact double roll</strong>: A&gt;D: 1-(D+2)(2D+3)/((A+1)&sup2;&times;6) | A&le;D: A(4A+5)/(6(A+1)(D+1))
          </Note>
        </FormulaSection>

        <FormulaSection title="8. Attack Speed">
          <Formula code={`speed = weapon.attackSpeed
if (rapid style): speed -= 1
// Pacts: F7 (spell -2t), F8 (powered staff -3t), J2 (light melee -1t), K4 (bow -1t), K8 (xbow -2t)
speed = MAX(1, speed)`} />
        </FormulaSection>

        <FormulaSection title="9. DPS Calculation">
          <Formula code={`// Standard:
DPS = (maxHit / 2 × accuracy) / (speed × 0.6)

// Always-max (N6 crossbow):
DPS = (maxHit × accuracy) / (speed × 0.6)

// Scythe: hits depend on target size (1×1=1, 2×2=2, 3×3+=3 hits)
// hit1 = full max, hit2 = FLOOR(max/2), hit3 = FLOOR(max/4)
DPS = DPS_hit1 + DPS_hit2 + DPS_hit3  // for 3×3+ targets

// Fang: min hit raised, average = (max + FLOOR(max × 3/20)) / 2
fangMin = FLOOR(maxHit × 3 / 20)
DPS = ((maxHit + fangMin) / 2 × accuracy) / (speed × 0.6)

// Tecpatl double hit:
DPS = standardDPS × 2`} />
        </FormulaSection>

        <FormulaSection title="10. Bonus Hit DPS">
          <Formula code={`// D2 Swift Strikes (light melee):
bonusDPS = FLOOR(maxHit × 0.40) / 2 × accuracy / interval

// D3 Blindside Blows (heavy melee):
bonusDPS = 0.15 × maxHit × accuracy / interval`} />
        </FormulaSection>

        <FormulaSection title="11. Echo Cascade">
          <Formula code={`echoRate = B2(+25% ranged) + K10(+5% all) + E2(+15% xbow)

// Without cascade:
echoDPS = baseDPS × echoRate

// With K3 (cascade 4x):
echoDPS = baseDPS × echoRate × (1 + p/2 + p/4 + p/8)

// E1 (bow echo never miss): echo accuracy = 100%`} />
        </FormulaSection>

        <FormulaSection title="12. Weapon Passives">
          <Note>
            <strong>Fang of the Hound</strong>: 5% chance Flames of Cerberus proc (bonus fire hit).
          </Note>
          <Note>
            <strong>Drygore Blowpipe</strong>: Double accuracy roll. 25% chance burn DoT (3-tick fire).
          </Note>
          <Note>
            <strong>King&apos;s Barrage</strong>: 2 bolts per attack (each at halved max), freeze.
          </Note>
          <Note>
            <strong>Nature&apos;s Recurve</strong>: 50% chance heal 10% damage (no DPS effect).
          </Note>
          <Note>
            <strong>Flask of Fervour</strong>: +1.5 flat DPS.
          </Note>
        </FormulaSection>

        <Card className="text-xs text-osrs-text-dim">
          <p>
            Sources:{" "}
            <a href="https://oldschool.runescape.wiki/w/Damage_per_second" target="_blank" rel="noopener noreferrer" className="text-osrs-gold hover:underline">OSRS Wiki — Damage per second</a>,{" "}
            <a href="https://oldschool.runescape.wiki/w/Combat" target="_blank" rel="noopener noreferrer" className="text-osrs-gold hover:underline">OSRS Wiki — Combat</a>.
            Pact modifiers are DP-league specific.
          </p>
        </Card>
      </div>
    </div>
  );
}

function FormulaSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <h2 className="text-lg font-bold text-osrs-gold mb-3" style={{ fontFamily: "var(--font-runescape)" }}>
        {title}
      </h2>
      <div className="space-y-2">
        {children}
      </div>
    </Card>
  );
}

function Formula({ code }: { code: string }) {
  return (
    <pre className="bg-osrs-darker rounded-lg p-3 text-xs text-osrs-text font-mono overflow-x-auto whitespace-pre-wrap">
      {code}
    </pre>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-osrs-text-dim">{children}</p>
  );
}
