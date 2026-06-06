const fs = require('fs');
const path = './src/pages/ResearchPage.tsx';
let content = fs.readFileSync(path, 'utf8');

const keyPointsMap = {
  1: [
    "Visual symptoms occur in approximately 90% of concussion cases.",
    "A modified 4-component VOMS improves sensitivity for detecting acute concussion.",
    "Oculomotor-based vision therapy shows clear remediation potential for vergence and accommodative dysfunction."
  ],
  2: [
    "Visual dysfunction is among the most common and debilitating post-concussion sequelae.",
    "Convergence insufficiency and accommodative deficits are highly prevalent.",
    "Vision therapy and vestibular rehabilitation are evidence-based treatment pathways."
  ],
  3: [
    "Fixational eye movement (FEM) drift is significantly associated with visual memory performance.",
    "Nausea symptom intensity on the VOMS correlates with FEM abnormalities.",
    "Ocular dysfunction signals broader neurocognitive compromise, not just isolated visual issues."
  ],
  4: [
    "Oculomotor deficits persist even after athletes are cleared as clinically symptom-free.",
    "Smooth pursuit, saccadic accuracy, and vergence remain affected beyond clinical clearance.",
    "Supports integrating objective eye tracking as a mandatory, independent biomarker."
  ],
  5: [
    "Concussed patients show significantly fewer fixations and lower saccade speed/accuracy ratios.",
    "Age and sex are key modifiers of saccade performance post-concussion.",
    "Automated saccade testing serves as a reliable, quantitative biomarker for oculomotor impairment."
  ],
  6: [
    "EyeBOX composite scores above 10 indicate high concussion likelihood.",
    "Strong associations exist between BOX score and return-to-learn/return-to-play timelines.",
    "Validates eye tracking for monitoring recovery progress and predicting readiness to return."
  ],
  7: [
    "Concussed athletes show elevated smooth pursuit gain within 48 hours of injury.",
    "Significantly more intrusive saccades occur during tracking tasks.",
    "Compensatory eye movements reveal neural inefficiency in midbrain and cerebellar pathways."
  ],
  8: [
    "fMRI measures show actual changes in brain activity following 12–16 sessions of vision therapy.",
    "Therapy drives real structural and functional brain reorganization, not just symptom improvement.",
    "Demonstrates the neuroscience behind why vision-based rehabilitation works after concussion."
  ],
  9: [
    "Standard neurological and posterior segment eye exams often miss TBI-specific visual dysfunction.",
    "Comprehensive vision rehab resolved symptoms in a 14-year-old athlete with normal standard exams.",
    "Argues for universal TBI-specific visual screening and structured vision therapy."
  ],
  10: [
    "Vestibular rehabilitation therapy (VRT) significantly reduces dizziness and improves balance.",
    "VRT accelerates return-to-activity compared to rest-alone protocols.",
    "Early initiation of VRT produces superior outcomes for post-concussive symptoms."
  ],
  11: [
    "Visual-vestibular symptoms persist in 30–88% of individuals with delayed concussion recovery.",
    "Most patients do not receive rehabilitation until months after injury due to lack of standardized pathways.",
    "Calls for interdisciplinary, early-intervention rehabilitation protocols from first contact."
  ],
  12: [
    "Formally defines concussion as a TBI caused by impulsive force to the brain.",
    "Acknowledges visual and oculomotor dysfunction as core features of sport-related concussion.",
    "Supports the integration of objective eye tracking and VOMS as standard clinical tools."
  ],
  13: [
    "Identifies convergence insufficiency, saccadic dysfunction, and smooth pursuit deficits as core targets.",
    "Establishes a clinical hierarchy for deploying visual rehabilitation post-concussion.",
    "Represents the most authoritative ophthalmological position on visual rehabilitation after mTBI."
  ],
  14: [
    "Lutein and zeaxanthin supplementation yielded a 12% improvement in visual-motor reaction time.",
    "Athletes demonstrated significant enhancements in contrast sensitivity.",
    "Targeted nutritional interventions increase macular pigment optical density for faster neural processing."
  ],
  15: [
    "Mild dehydration (1-2% body mass loss) significantly degrades saccadic accuracy.",
    "Hypohydration increases smooth pursuit latency and slows overall choice reaction time.",
    "Optimal hydration is critical for maintaining the neurological efficiency required for elite visual processing."
  ],
  16: [
    "6-week stroboscopic visual training resulted in a 15% improvement in pitch recognition speed.",
    "SVT led to a significant reduction in swing decision latency.",
    "EEG data revealed enhanced cortical activation in the visual cortex, suggesting permanent neuroplastic changes."
  ],
  17: [
    "Structured sports vision training yields statistically significant improvements in objective sports metrics.",
    "SVT enhances on-field performance such as batting average, save percentage, and unforced error rates.",
    "Dynamic, sport-specific cognitive loads are more effective than static visual exercises."
  ],
  18: [
    "Subtle declines in visual-motor synchronization often precede physical injuries or performance slumps.",
    "Longitudinal oculomotor analytics can build predictive models of athletic performance.",
    "Validates the necessity of continuous, objective neuro-visual data collection to optimize training loads."
  ],
  19: [
    "Visual symptoms occur in approximately 90% of concussion cases.",
    "No gold standard for acute concussion confirmation currently exists.",
    "Visual function testing based on symptoms remains the standard of care."
  ],
  20: [
    "Physiological dysfunction can persist beyond symptom resolution.",
    "VR eye tracking at 100Hz effectively measures oculomotor function at multiple recovery timepoints.",
    "Supports objective oculomotor measurement as the benchmark for true recovery."
  ],
  21: [
    "Eye tracking, smooth pursuit, and saccadic testing show strong diagnostic promise for SRC.",
    "Applying reference standard thresholds maps the clinical utility of various ocular tools.",
    "Variability in methodology limits direct comparison, highlighting the need for standardized protocols."
  ],
  22: [
    "Subacute evaluation beyond 72 hours requires a multimodal approach including oculomotor testing.",
    "The Child SCOAT6 and SCOAT6 tools incorporate these domains as required assessment elements.",
    "Neuromuscular training protocols and mouthguard use show reduced SRC rates in adolescent athletes."
  ],
  23: [
    "Early vestibular rehabilitation therapy shortens return-to-play time compared to rest alone.",
    "Younger athletes demonstrate more difficulty with visual memory and reaction time post-concussion.",
    "Vision and cognitive training are essential components of a complete athlete concussion recovery program."
  ]
};

for (const [id, points] of Object.entries(keyPointsMap)) {
  const idMatch = new RegExp(`(id:\\s*${id},[\\s\\S]*?section:\\s*\\d+)`, 'g');
  const pointsStr = `\n    keyPoints: [\n      ${points.map(p => `'${p.replace(/'/g, "\\'")}'`).join(',\n      ')}\n    ]`;
  content = content.replace(idMatch, `$1,${pointsStr}`);
}

const articleCardTarget = `              <p className="text-white/70 text-sm leading-relaxed mb-6">
                {article.abstract}
              </p>
            </div>`;
            
const articleCardReplacement = `              <p className="text-white/70 text-sm leading-relaxed mb-6">
                {article.abstract}
              </p>
              
              {article.keyPoints && article.keyPoints.length > 0 && (
                <div className="pt-4 border-t border-white/10 mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ares-teal)] block mb-3">
                    Key Takeaways
                  </span>
                  <ul className="space-y-2 mb-6">
                    {article.keyPoints.map((point, idx) => (
                      <li key={idx} className="text-white/80 text-sm flex items-start gap-2">
                        <span className="text-[var(--color-ares-teal)] mt-0.5">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>`;

content = content.replace(articleCardTarget, articleCardReplacement);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated articles with key points.');
