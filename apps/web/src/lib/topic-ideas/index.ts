export type FrameworkStep = {
  label: string
  description: string
  vocabulary: string[]
}

export type SpeakingExample = {
  context: string
  dialogue: { speaker: string; text: string }[]
}

export type WritingExample = {
  context?: string
  taskType: string
  prompt: string
  sample: string
}

export type ReadingExample = {
  context: string
  passage: string
}

export type ListeningExample = {
  context: string
  script: { speaker: string; text: string }[]
}

export type TopicFramework = {
  id: string
  name: string
  issue: string
  description: string
  steps: FrameworkStep[]
  examples: {
    speaking: SpeakingExample
    writing: WritingExample
    reading: ReadingExample
    listening: ListeningExample
  }
}

export type Topic = {
  id: string
  name: string
  icon: string
  description: string
  frameworks: TopicFramework[]
}

export const SKILLS = ['listening', 'reading', 'writing', 'speaking'] as const
export type Skill = typeof SKILLS[number]

export const SKILL_LABELS: Record<Skill, string> = {
  listening: 'Listening',
  reading: 'Reading',
  writing: 'Writing',
  speaking: 'Speaking',
}

export const TOPICS: Topic[] = [
  {
    id: 'health',
    name: 'Health & Disease',
    icon: '🏥',
    description: 'Understand and discuss health conditions, healthcare systems, and psychological well-being.',
    frameworks: [
      {
        id: 'disease-analysis',
        name: 'Disease Analysis',
        issue: 'Infectious, chronic, or lifestyle diseases',
        description:
          'A structured sequence for analysing any disease — from what it is to how to prevent it. Use this when a passage or question focuses on a specific condition or health problem.',
        steps: [
          {
            label: 'Definition',
            description:
              'State what the disease is, its nature, key characteristics, and who it affects.',
            vocabulary: [
              'characterised by',
              'a condition in which',
              'affects approximately',
              'predominantly affects',
            ],
          },
          {
            label: 'Causes',
            description:
              'Identify what triggers or leads to the disease — biological, environmental, or behavioural factors.',
            vocabulary: [
              'attributed to',
              'risk factors include',
              'exposure to',
              'linked to',
              'triggered by',
            ],
          },
          {
            label: 'Classification',
            description: 'Distinguish between types or categories of the disease.',
            vocabulary: [
              'broadly classified into',
              'can be categorised as',
              'distinguished by',
              'subdivided into',
            ],
          },
          {
            label: 'Symptoms & Effects',
            description: 'Describe how the disease presents and its consequences if untreated.',
            vocabulary: [
              'presents with',
              'commonly manifests as',
              'in severe cases',
              'complications include',
            ],
          },
          {
            label: 'Treatment',
            description: 'Explain how the disease is managed or cured.',
            vocabulary: [
              'treated with',
              'therapeutic approaches include',
              'in conjunction with',
              'clinical evidence supports',
            ],
          },
          {
            label: 'Prevention',
            description: 'Identify how individuals and governments can reduce incidence.',
            vocabulary: [
              'preventable through',
              'early screening',
              'mitigated by',
              'public health campaigns',
            ],
          },
        ],
        examples: {
          speaking: {
            context: 'IELTS Speaking Part 3 — The examiner asks why lifestyle diseases have increased.',
            dialogue: [
              {
                speaker: 'Examiner',
                text: 'Why do you think lifestyle diseases like Type 2 diabetes have become so widespread in recent decades?',
              },
              {
                speaker: 'Candidate',
                text: "Well, I think the main reason is the shift towards sedentary jobs and highly processed diets. Diabetes — specifically Type 2 — is characterised by the body's inability to regulate blood sugar effectively, and this is largely attributed to insulin resistance built up over years of poor lifestyle choices.",
              },
              {
                speaker: 'Examiner',
                text: 'And do you think individuals or governments are more responsible for addressing this?',
              },
              {
                speaker: 'Candidate',
                text: "Both, I'd argue — but in different ways. Individuals need to take responsibility for exercise and diet, but governments must create the conditions for healthy choices to be accessible. That means investing in public health campaigns, restricting junk food advertising, and making early screening free. Prevention is far cheaper than treatment once the disease is established.",
              },
            ],
          },
          writing: {
            taskType: 'Task 2 — Problem & Solution',
            prompt:
              'The prevalence of lifestyle diseases such as diabetes and obesity is increasing globally. What are the causes of this trend, and what measures can be taken to address it?',
            sample:
              'The global rise of non-communicable diseases represents one of the defining public health crises of the twenty-first century. Type 2 diabetes, for instance, is characterised by chronic insulin resistance — a condition in which the body fails to process glucose efficiently — and now affects approximately 500 million people worldwide. This surge is attributed primarily to two converging forces: increasingly sedentary occupations and the proliferation of calorie-dense, nutritionally poor foods. While the condition can be broadly classified into Type 1 (autoimmune) and Type 2 (lifestyle-related), it is the latter that accounts for over 90% of cases and is almost entirely preventable. Effective treatment ranges from insulin therapy to structured lifestyle interventions, yet the most impactful strategy remains prevention: regular physical activity, reduced sugar consumption, and subsidised early screening have each been shown to significantly reduce incidence at a population level.',
          },
          reading: {
            context: 'Academic passage — how to follow the structure when reading about a disease.',
            passage:
              'Type 2 diabetes is a chronic metabolic disorder characterised by elevated blood glucose levels resulting from insulin resistance or insufficient insulin production [Definition]. While genetic predisposition plays a role, the condition is most strongly attributed to lifestyle factors — physical inactivity, excessive caloric intake, and prolonged stress [Causes]. Clinically, it is distinguished from Type 1 diabetes by its gradual onset and its strong correlation with obesity [Classification]. Left unmanaged, it commonly manifests as cardiovascular complications, neuropathy, and impaired kidney function [Symptoms & Effects]. Current treatment protocols include metformin therapy, dietary restructuring, and in advanced cases, insulin supplementation [Treatment]. Public health authorities emphasise, however, that regular aerobic exercise and reduced consumption of refined sugars are sufficient to mitigate risk in the majority of pre-diabetic individuals [Prevention].',
          },
          listening: {
            context: 'University health seminar — a lecturer introduces a session on chronic disease.',
            script: [
              {
                speaker: 'Lecturer',
                text: "Today we're going to work through Type 2 diabetes as a case study. Let's start with what it actually is: a condition in which the body cannot regulate blood sugar levels properly — the cells stop responding to insulin.",
              },
              {
                speaker: 'Student',
                text: 'Is that the same for all types of diabetes?',
              },
              {
                speaker: 'Lecturer',
                text: "Good question — no. We can classify it broadly into Type 1, which is autoimmune, and Type 2, which is almost entirely linked to lifestyle factors. That's why Type 2 is our focus today — it's the one we can actually influence through behaviour.",
              },
              {
                speaker: 'Student',
                text: 'So what are the main risk factors?',
              },
              {
                speaker: 'Lecturer',
                text: "Physical inactivity and high-sugar diets are the two biggest. Over time, these lead to insulin resistance. The consequences — if we don't catch it early — include heart disease, kidney failure, and nerve damage. The good news is that with early screening and lifestyle changes, it's largely preventable.",
              },
            ],
          },
        },
      },
      {
        id: 'healthcare-system',
        name: 'Healthcare System',
        issue: 'Public vs private healthcare, access, funding, reform',
        description:
          'A framework for discussing how healthcare is organised, what problems it faces, and how those problems might be solved. Use when the topic focuses on systems, policies, or access rather than a specific disease.',
        steps: [
          {
            label: 'Current State',
            description:
              'Describe how the healthcare system is structured — who funds it, who delivers it, who can access it.',
            vocabulary: [
              'publicly funded',
              'two-tier system',
              'universal coverage',
              'out-of-pocket expenses',
            ],
          },
          {
            label: 'Challenges',
            description:
              'Identify the key problems the system faces — capacity, cost, inequality, or quality.',
            vocabulary: [
              'overburdened',
              'significant disparities',
              'unequal access',
              'underfunded',
              'rising demand',
            ],
          },
          {
            label: 'Root Causes',
            description: 'Explain why these challenges exist.',
            vocabulary: [
              'ageing population',
              'chronic underfunding',
              'administrative inefficiency',
              'driven by',
            ],
          },
          {
            label: 'Proposed Solutions',
            description: 'Outline realistic reforms.',
            vocabulary: [
              'preventive care model',
              'public-private partnership',
              'increased investment in',
              'means-tested subsidies',
            ],
          },
          {
            label: 'Stakeholder Roles',
            description:
              'Clarify what government, private sector, and individuals each need to contribute.',
            vocabulary: [
              'government responsibility',
              'individual accountability',
              'corporate contribution',
              'collaborative approach',
            ],
          },
        ],
        examples: {
          speaking: {
            context: 'IELTS Speaking Part 3 — The examiner asks about public vs private healthcare.',
            dialogue: [
              {
                speaker: 'Examiner',
                text: 'Some people argue that healthcare should be entirely provided by the government. Do you agree?',
              },
              {
                speaker: 'Candidate',
                text: "Largely yes, though I think a mixed approach is more realistic. In countries with purely public systems, universal coverage is possible, but the system is often overburdened — long waiting times and underfunding are common challenges.",
              },
              {
                speaker: 'Examiner',
                text: 'What do you think causes these problems in public healthcare?',
              },
              {
                speaker: 'Candidate',
                text: "It's mostly a combination of an ageing population placing greater demand on services and chronic underfunding from governments balancing budgets. The solution isn't to privatise — which simply creates a two-tier system where quality depends on wealth — but to invest more in preventive care so that people arrive at hospitals less sick, and less often.",
              },
            ],
          },
          writing: {
            taskType: 'Task 2 — Discussion',
            prompt:
              'Some people believe that healthcare should be provided entirely by the government. Others think that private healthcare leads to better quality services. Discuss both views and give your own opinion.',
            sample:
              'The question of how healthcare should be funded divides opinion across political and economic lines. Publicly funded systems, such as those in the UK or Canada, provide universal coverage — ensuring that access is not determined by personal wealth. However, these systems are frequently overburdened: rising demand driven by ageing populations and chronic underfunding has led to significant waiting times. Proponents of private healthcare argue that market competition drives quality and innovation, though critics note this creates stark inequalities, with effective care available only to those who can afford it. A more sustainable model may lie in public-private partnership: a government-guaranteed baseline of care for all citizens, supplemented by private provision for those who choose it. Crucially, greater investment in preventive health — reducing the incidence of costly chronic conditions before they develop — would ease pressure on both systems simultaneously.',
          },
          reading: {
            context: 'Policy report — how to follow the structure when reading about a healthcare system.',
            passage:
              'The National Health Service provides comprehensive care funded through general taxation, offering universal coverage to all residents regardless of income [Current State]. However, the system faces mounting pressure: rising demand, an ageing demographic, and real-terms budget constraints have left many departments chronically overburdened, with elective waiting lists at record levels [Challenges]. These difficulties stem principally from structural underfunding relative to comparable nations, compounded by administrative inefficiency [Root Causes]. Policy analysts propose increased capital investment in primary care, expansion of preventive services, and carefully regulated public-private partnerships for non-emergency procedures [Proposed Solutions]. Delivering reform requires coordinated action: government must commit sustained funding, the private sector must operate within regulated quality frameworks, and individuals must engage proactively with preventive health programmes [Stakeholder Roles].',
          },
          listening: {
            context: 'Radio interview — a health policy expert discusses healthcare funding.',
            script: [
              {
                speaker: 'Host',
                text: 'Our guest has spent twenty years analysing healthcare systems. How would you describe the state of public healthcare right now?',
              },
              {
                speaker: 'Expert',
                text: 'The honest answer is: under significant strain. Most publicly funded systems were designed for a very different demographic reality. We have ageing populations, more complex chronic conditions, and demand rising faster than funding.',
              },
              {
                speaker: 'Host',
                text: 'Is privatisation the answer?',
              },
              {
                speaker: 'Expert',
                text: "Not in my view — and the evidence doesn't support it. What privatisation does is create unequal access. People who need healthcare most are often those who can afford it least. We need genuine investment in preventive care — catching problems early, before they become expensive emergencies — alongside better coordination between government and local services.",
              },
            ],
          },
        },
      },
      {
        id: 'mental-health',
        name: 'Mental Health & Well-being',
        issue: 'Workplace stress, anxiety, social pressures, stigma',
        description:
          'A framework for discussing psychological health — from stigma and causes to support systems and prevention. Use when the topic focuses on stress, anxiety, depression, or well-being in modern life.',
        steps: [
          {
            label: 'Definition & Context',
            description:
              'Establish what mental health means and why it has become prominent.',
            vocabulary: [
              'psychological well-being',
              'growing awareness',
              'increasingly recognised',
              'one in four adults',
            ],
          },
          {
            label: 'Contributing Factors',
            description:
              'Identify social, workplace, or environmental pressures that negatively affect mental health.',
            vocabulary: [
              'chronic stress',
              'social isolation',
              'digital overload',
              'work-life imbalance',
              'financial pressure',
            ],
          },
          {
            label: 'Recognising Symptoms',
            description:
              'Describe how conditions present and the challenge of recognising them.',
            vocabulary: [
              'persistent low mood',
              'difficulty concentrating',
              'often goes undiagnosed',
              'reluctance to seek help',
            ],
          },
          {
            label: 'Support Systems',
            description:
              'Explain types of support available — professional, community, and institutional.',
            vocabulary: [
              'access to counselling',
              'employer-provided support',
              'community mental health services',
              'peer support networks',
            ],
          },
          {
            label: 'Prevention & Well-being',
            description:
              'Outline habits and policies that protect mental health before problems develop.',
            vocabulary: [
              'building resilience',
              'mindfulness practices',
              'reducing stigma',
              'psychological safety',
              'reasonable adjustments',
            ],
          },
        ],
        examples: {
          speaking: {
            context: "IELTS Speaking Part 3 — The examiner asks about mental health in the workplace.",
            dialogue: [
              {
                speaker: 'Examiner',
                text: "Do you think employers have a responsibility to protect their employees' mental health?",
              },
              {
                speaker: 'Candidate',
                text: "Absolutely — and I'd say it's both a moral and a business obligation. Chronic workplace stress leads to burnout, and burnout is expensive: absenteeism, turnover, reduced productivity. Employers who invest in psychological safety — creating an environment where people can raise concerns without fear — actually see better performance outcomes.",
              },
              {
                speaker: 'Examiner',
                text: "But isn't mental health ultimately a personal matter?",
              },
              {
                speaker: 'Candidate',
                text: "It's both personal and systemic. An individual can practise mindfulness and build resilience, but if the work environment itself is the source of the problem — unrealistic deadlines, no access to counselling — then personal strategies have limited impact. The structural conditions matter as much as individual habits.",
              },
            ],
          },
          writing: {
            taskType: 'Task 2 — Opinion (Agree/Disagree)',
            prompt:
              'Employers should be legally required to provide mental health support to their employees. To what extent do you agree or disagree?',
            sample:
              "As awareness of psychological well-being grows, the question of whether employers bear a legal responsibility to support their workers' mental health has become increasingly urgent. I broadly agree that such obligations should be formalised. The modern workplace has become a significant source of mental health strain: work-life imbalance, digital overload, and financial pressure combine to create environments in which one in four adults will experience a diagnosable condition at some point. Many cases — persistent low mood, difficulty concentrating — often go undiagnosed precisely because workplace cultures discourage disclosure. Requiring employers to provide access to counselling, implement reasonable adjustments for affected staff, and train managers to recognise early warning signs would address this gap systematically. Critically, the evidence suggests such investments are not merely ethical but economically rational: organisations that foster psychological safety report lower turnover and higher productivity, meaning the business case aligns with the moral one.",
          },
          reading: {
            context: 'Academic article — how to follow the structure when reading about mental health.',
            passage:
              'Mental health, broadly defined as a state of psychological well-being in which an individual can cope with normal stresses of life, has become increasingly recognised as a public health priority [Definition & Context]. Research consistently identifies chronic workplace stress, social isolation amplified by digital communication, and economic insecurity as primary contributing factors [Contributing Factors]. Despite this, conditions such as anxiety frequently go undiagnosed — partly because symptoms like persistent fatigue are easily attributed to other causes, and partly due to stigma around disclosure [Recognising Symptoms]. Support structures vary widely: some employers offer employee assistance programmes, while community mental health services provide a broader safety net where adequately funded [Support Systems]. A growing consensus emphasises that prevention is more effective than remediation: building resilience through mindfulness, reducing stigma through open dialogue, and embedding psychological safety into organisational culture are each associated with measurably better outcomes [Prevention & Well-being].',
          },
          listening: {
            context: 'Podcast discussion — two colleagues discuss mental health at work.',
            script: [
              {
                speaker: 'Host',
                text: "We're talking about workplace mental health today. What does it actually mean in practice?",
              },
              {
                speaker: 'Guest',
                text: "At the most basic level, it means ensuring people can do their jobs without the environment itself making them ill. Chronic stress — persistent pressure without recovery time — is one of the leading contributors to anxiety and burnout. The challenge is that these symptoms often go unrecognised, even by the people experiencing them.",
              },
              {
                speaker: 'Host',
                text: 'So what should companies actually be doing?',
              },
              {
                speaker: 'Guest',
                text: "First, make support accessible — counselling, mental health days, flexible arrangements. But more importantly, work on the culture. If people are afraid to say they're struggling, none of the formal support matters. Psychological safety — the sense that you can speak honestly without being penalised — is probably the single most important factor.",
              },
            ],
          },
        },
      },
    ],
  },
  {
    id: 'education',
    name: 'Education & Learning',
    icon: '📚',
    description:
      'Analyse education systems, compare learning approaches, and discuss issues of access and equity.',
    frameworks: [
      {
        id: 'education-system',
        name: 'Education System Analysis',
        issue: 'Exam pressure, curriculum design, public vs private schooling',
        description:
          'A framework for evaluating how an education system is structured — its purpose, its problems, and potential reforms. Use when the topic focuses on schools, curricula, or government education policy.',
        steps: [
          {
            label: 'Purpose & Goals',
            description:
              'Define what the education system is designed to achieve.',
            vocabulary: [
              'develop critical thinking',
              'equip students with',
              'foster civic responsibility',
              'academic attainment',
            ],
          },
          {
            label: 'Current Structure',
            description:
              'Describe how the system is organised — years of schooling, public vs private, assessment methods.',
            vocabulary: [
              'compulsory education',
              'standardised testing',
              'national curriculum',
              'two-tier schooling',
            ],
          },
          {
            label: 'Problems & Gaps',
            description:
              'Identify where the system is failing — who it is not serving, what skills it is not developing.',
            vocabulary: [
              'over-emphasis on rote learning',
              'exam-driven culture',
              'achievement gaps',
              'neglects soft skills',
            ],
          },
          {
            label: 'Reform Proposals',
            description: 'Outline realistic changes that could improve the system.',
            vocabulary: [
              'project-based learning',
              'teacher professional development',
              'needs-based funding',
              'curriculum reform',
            ],
          },
          {
            label: 'Expected Outcomes',
            description: 'Explain what a reformed system would produce.',
            vocabulary: [
              'well-rounded graduates',
              'reduced inequality',
              'improved employability',
              'lifelong learners',
            ],
          },
        ],
        examples: {
          speaking: {
            context: 'IELTS Speaking Part 3 — The examiner asks about exam pressure in schools.',
            dialogue: [
              {
                speaker: 'Examiner',
                text: 'Do you think the current education system prepares young people well for adult life?',
              },
              {
                speaker: 'Candidate',
                text: "Honestly, not as well as it should. The system does a reasonable job of developing academic attainment, but there's a significant over-emphasis on standardised testing and rote memorisation. Students learn to pass exams rather than to think critically or solve real problems.",
              },
              {
                speaker: 'Examiner',
                text: 'What changes would you suggest?',
              },
              {
                speaker: 'Candidate',
                text: "I'd advocate for a shift towards project-based learning alongside traditional academics — students solving real problems in teams, not just recalling facts under timed conditions. Finland's model is often cited because it prioritises teacher quality and student well-being over exam rankings, and the outcomes in terms of critical thinking are consistently strong. Well-rounded graduates are ultimately more valuable to employers and society than students optimised for a single high-stakes test.",
              },
            ],
          },
          writing: {
            taskType: 'Task 2 — Discussion',
            prompt:
              'Some people believe the purpose of education is to prepare students for employment. Others argue education should develop students as rounded individuals. Discuss both views and give your own opinion.',
            sample:
              "The debate over the primary purpose of education reflects a tension between economic utility and human development. Those who argue that schooling exists to equip students with employable skills point to a competitive labour market: employers consistently report shortages of graduates with practical competencies, and a curriculum prioritising these needs is, they argue, simply pragmatic. Critics contend, however, that an exam-driven culture oriented around employment neglects equally vital goals: fostering civic responsibility, critical thinking, and emotional intelligence. A student optimised purely for economic productivity may struggle to participate meaningfully in a democracy or navigate complex social challenges. In my view, the distinction is ultimately false: the most effective education systems — evidenced by countries such as Finland — demonstrate that developing well-rounded individuals and producing capable graduates are complementary rather than competing goals. The reform most needed is not a change in purpose but in method: replacing rote memorisation with collaborative, project-based learning that develops both intellectual rigour and broader human capabilities.",
          },
          reading: {
            context: 'Policy review — how to follow the structure when reading about an education system.',
            passage:
              'The stated purpose of compulsory education encompasses both academic attainment and the development of civic values — equipping students not only with knowledge, but with critical thinking and social participation capacity [Purpose & Goals]. In practice, most systems remain structured around a national curriculum with progress assessed through standardised examinations [Current Structure]. Critics argue this model over-emphasises rote learning at the expense of creativity, generating significant achievement gaps between students from different socioeconomic backgrounds [Problems & Gaps]. Education researchers propose integrating project-based learning, increased investment in teacher professional development, and needs-based funding directed to underperforming schools [Reform Proposals]. Where such reforms have been implemented — notably in Finland — results suggest measurable improvements in academic outcomes and student well-being, producing graduates better equipped for the adaptive demands of a rapidly changing labour market [Expected Outcomes].',
          },
          listening: {
            context: 'University seminar — a lecturer introduces education policy analysis.',
            script: [
              {
                speaker: 'Lecturer',
                text: "Let's start with a deceptively simple question: what is education actually for? Most government documents give two answers — develop academic knowledge, and prepare young people for life and work. The problem is these goals often pull in different directions when designing a curriculum.",
              },
              {
                speaker: 'Student',
                text: 'How so? Surely academic knowledge is useful for work?',
              },
              {
                speaker: 'Lecturer',
                text: "Up to a point. But the current structure — standardised testing, league tables — creates an exam-driven culture where teachers teach to the test and students memorise rather than understand. The achievement gaps this creates are well-documented. What we're seeing is a push towards project-based learning and needs-based funding. Evidence from countries like Finland suggests we can have both rigour and equity — but it requires fundamental reform, not tinkering at the edges.",
              },
            ],
          },
        },
      },
      {
        id: 'learning-methods',
        name: 'Learning Methods',
        issue: 'Online vs traditional learning, technology in education, self-directed study',
        description:
          'A framework for comparing or evaluating how people learn. Use when the topic focuses on a specific pedagogical approach, online vs classroom debate, or technology in education.',
        steps: [
          {
            label: 'Context & Learner Profile',
            description:
              'Establish who is learning, in what context, and what their specific needs are.',
            vocabulary: [
              'self-directed learner',
              'adult education',
              'diverse learning styles',
              'prior knowledge',
            ],
          },
          {
            label: 'Method & Approach',
            description:
              'Describe the learning method — how it delivers content and engages learners.',
            vocabulary: [
              'synchronous vs asynchronous',
              'instructor-led',
              'experiential learning',
              'flipped classroom',
            ],
          },
          {
            label: 'Mechanism',
            description:
              'Explain how the method works — the process by which learning actually occurs.',
            vocabulary: [
              'spaced repetition',
              'active recall',
              'peer collaboration',
              'immediate feedback',
            ],
          },
          {
            label: 'Benefits',
            description: 'Identify the genuine advantages of this method for specific contexts.',
            vocabulary: [
              'flexible access',
              'personalised pace',
              'deeper engagement',
              'cost-effective',
            ],
          },
          {
            label: 'Limitations',
            description: 'Acknowledge where the method falls short.',
            vocabulary: [
              'limited social interaction',
              'requires self-discipline',
              'digital divide',
              'reduced accountability',
            ],
          },
          {
            label: 'Optimal Use',
            description: 'Suggest conditions under which the method works best.',
            vocabulary: [
              'most effective when',
              'best suited to',
              'complemented by',
              'hybrid approach',
            ],
          },
        ],
        examples: {
          speaking: {
            context: 'IELTS Speaking Part 3 — The examiner asks about online learning.',
            dialogue: [
              {
                speaker: 'Examiner',
                text: 'Do you think online learning is as effective as traditional classroom education?',
              },
              {
                speaker: 'Candidate',
                text: "It really depends on the learner and what they're studying. For self-directed adult learners — someone upskilling professionally — online learning offers genuine advantages: flexible access, personalised pace, and lower cost. The mechanism works well when content allows for asynchronous engagement and self-testing.",
              },
              {
                speaker: 'Examiner',
                text: 'But are there situations where it falls short?',
              },
              {
                speaker: 'Candidate',
                text: "Definitely. The digital divide means online education isn't equally accessible — you need reliable internet and a suitable device, which many families still lack. And for younger learners especially, limited social interaction and reduced accountability can undermine engagement. So I'd say the optimal model is hybrid: online delivery for content, in-person sessions for collaboration and the social aspects that a screen cannot replicate.",
              },
            ],
          },
          writing: {
            taskType: 'Task 2 — Discussion',
            prompt:
              'Some people believe that online learning is more effective than traditional classroom education. Others argue that face-to-face teaching is always superior. Discuss both views and give your own opinion.',
            sample:
              'The rapid expansion of online education has prompted debate about whether digital learning can match traditional classroom instruction. Proponents of online learning emphasise structural advantages: content can be delivered asynchronously, allowing learners to progress at their own pace, while spaced repetition tools and immediate feedback have been shown to improve long-term retention. For self-directed adult learners pursuing professional development, these benefits are considerable. However, advocates of traditional teaching argue that the classroom provides something online platforms cannot easily replicate: real-time dialogue with an instructor and the accountability that comes from a shared physical environment. Research consistently shows that younger students benefit from instructor-led learning with high levels of peer collaboration. In my view, neither model is universally superior. The most productive approach is a well-designed hybrid: online delivery for content acquisition, supplemented by in-person sessions that foster discussion and the human connections central to meaningful learning.',
          },
          reading: {
            context: 'Academic review — how to follow the structure when reading about a learning method.',
            passage:
              'This review focuses on asynchronous online learning — self-paced digital courses accessed independently — and its effectiveness for adult learners returning to education after employment [Context & Learner Profile]. Such programmes deliver content through recorded video lectures, interactive quizzes, and discussion forums [Method & Approach]. The mechanism underpinning effective online learning draws on spaced repetition and active recall, with the most successful platforms building retrieval practice into their content design [Mechanism]. Benefits are pronounced for learners with existing professional experience: flexible access, cost-effectiveness, and the ability to apply concepts immediately in a work context are associated with higher completion rates [Benefits]. Significant limitations persist, however: learners with lower digital literacy or those requiring external accountability consistently underperform relative to classroom counterparts [Limitations]. The evidence therefore suggests asynchronous online learning is most effective as one component of a hybrid model — pairing digital content delivery with periodic synchronous sessions for social reinforcement and instructor feedback [Optimal Use].',
          },
          listening: {
            context: 'Education conference panel — speakers discuss the future of learning methods.',
            script: [
              {
                speaker: 'Moderator',
                text: 'The pandemic forced millions of students into online learning almost overnight. What did we learn?',
              },
              {
                speaker: 'Panellist',
                text: 'The clearest finding is that context matters enormously. For university-level adult learners who are self-directed and digitally literate, asynchronous online courses can be genuinely effective — particularly when built around active recall rather than just recorded lectures.',
              },
              {
                speaker: 'Moderator',
                text: 'But?',
              },
              {
                speaker: 'Panellist',
                text: "But for younger students and anyone who needs social accountability to stay engaged, the limitations become significant very quickly. The digital divide is real and widens existing achievement gaps. And there's something about being physically in a room with a teacher and peers that we haven't found a convincing digital substitute for. The honest conclusion is that hybrid models are where the evidence points for most learner profiles.",
              },
            ],
          },
        },
      },
      {
        id: 'access-equity',
        name: 'Access & Equity in Education',
        issue: 'Educational inequality, developing countries, gender and socioeconomic gaps',
        description:
          'A framework for discussing unequal access to education — who is being left out, why, and what can be done. Use when the topic focuses on fairness, opportunity, or gaps between privileged and disadvantaged learners.',
        steps: [
          {
            label: 'Current Disparity',
            description:
              'Establish the scale and nature of inequality — which groups, which regions, how large the gap.',
            vocabulary: [
              'significant disparities',
              'enrolment rates',
              'gender gap in education',
              'rural-urban divide',
            ],
          },
          {
            label: 'Barriers',
            description:
              'Identify what prevents disadvantaged groups from accessing quality education.',
            vocabulary: [
              'financial constraints',
              'geographical isolation',
              'cultural norms',
              'inadequate infrastructure',
            ],
          },
          {
            label: 'Consequences',
            description: 'Explain the long-term effects of educational inequality.',
            vocabulary: [
              'perpetuates poverty cycles',
              'limits social mobility',
              'reduced economic productivity',
              'democratic participation',
            ],
          },
          {
            label: 'Policy Solutions',
            description:
              'Outline evidence-based interventions governments or organisations have used or proposed.',
            vocabulary: [
              'conditional cash transfers',
              'school feeding programmes',
              'teacher deployment incentives',
              'remote learning infrastructure',
            ],
          },
          {
            label: 'Individual & Community Agency',
            description:
              'Acknowledge the role that communities and individuals play alongside government action.',
            vocabulary: [
              'community-led initiatives',
              'parental engagement',
              'peer mentorship',
              'local ownership',
            ],
          },
        ],
        examples: {
          speaking: {
            context: 'IELTS Speaking Part 3 — The examiner asks about educational inequality.',
            dialogue: [
              {
                speaker: 'Examiner',
                text: 'Do you think children around the world have equal access to a good education?',
              },
              {
                speaker: 'Candidate',
                text: "Clearly not — and the disparities are significant. At a global level, enrolment rates in sub-Saharan Africa remain far below those in high-income countries, and within countries, the rural-urban divide is consistently stark. Children in remote areas face geographical isolation, teacher shortages, and inadequate infrastructure that their urban counterparts simply don't encounter.",
              },
              {
                speaker: 'Examiner',
                text: 'What would be the most effective way to address this?',
              },
              {
                speaker: 'Candidate',
                text: "Policy interventions with strong evidence include conditional cash transfers — where families receive financial support tied to school attendance — and school feeding programmes, which address the economic barrier while also improving concentration. But government policy alone isn't sufficient. Community-led initiatives and parental engagement are critical to sustainability. External programmes imposed without local buy-in tend to have poor long-term outcomes.",
              },
            ],
          },
          writing: {
            taskType: 'Task 2 — Problem & Solution',
            prompt:
              'In many countries, children from disadvantaged backgrounds have significantly less access to quality education than those from wealthier families. What are the causes of this problem, and what measures could be taken to reduce educational inequality?',
            sample:
              "Educational inequality represents one of the most persistent structural challenges in both developing and developed nations — a problem that is not merely unfair in itself, but self-reinforcing in its consequences. Significant disparities in educational access correlate closely with socioeconomic background, geographical location, and, in some regions, gender. The barriers driving this inequality are multiple: financial constraints that force families to prioritise immediate income over schooling, geographical isolation that makes qualified teacher recruitment difficult, and cultural norms that deprioritise education for girls. The consequences extend beyond individual outcomes: educational inequality perpetuates poverty cycles across generations and limits the broader economic productivity that high-quality human capital generates. Evidence-based interventions demonstrate, however, that these barriers are addressable. Conditional cash transfer programmes have successfully increased enrolment in multiple low-income countries. Teacher deployment incentives and school feeding programmes each address specific barriers. Critically, the most durable solutions combine policy intervention with community ownership: programmes designed with genuine local participation demonstrate consistently stronger long-term outcomes than those imposed externally.",
          },
          reading: {
            context: 'Policy brief — how to follow the structure when reading about education inequality.',
            passage:
              "Despite progress in primary school enrolment since 2000, substantial disparities in educational access persist across and within nations. In sub-Saharan Africa, completion rates for secondary education remain below 50% in several countries, while within high-income nations, a consistent achievement gap separates students from the lowest and highest socioeconomic quintiles [Current Disparity]. The barriers sustaining these inequalities are well-documented: for many low-income families, the direct and opportunity costs of schooling remain prohibitive; in rural areas, inadequate infrastructure and teacher shortages limit quality; cultural norms in some communities subordinate girls' education to domestic roles [Barriers]. The consequences are both individual and systemic — children denied quality education are significantly more likely to remain in poverty, limiting their own social mobility and reducing the aggregate human capital available to their national economy [Consequences]. A growing body of evidence supports targeted interventions: conditional cash transfers have demonstrably increased enrolment in Brazil, Mexico, and Bangladesh; school feeding programmes improve both attendance and cognitive performance; incentivised teacher deployment has reduced quality disparities in Rwanda and Vietnam [Policy Solutions]. Sustained progress, however, requires more than government programmes: community accountability mechanisms and meaningful parental engagement are critical factors in determining whether externally funded initiatives achieve durable outcomes [Individual & Community Agency].",
          },
          listening: {
            context: 'Development NGO briefing — a field researcher presents findings on education access.',
            script: [
              {
                speaker: 'Presenter',
                text: "I want to start with data. In the three districts we worked in, the gender gap in secondary school completion was over 30 percentage points — boys completing at around 60%, girls at under 30%. That's the disparity we're working with.",
              },
              {
                speaker: 'Colleague',
                text: 'What were the main barriers families cited?',
              },
              {
                speaker: 'Presenter',
                text: "Financial cost was most common — even where schools are nominally free, there are uniform costs, transport costs, foregone income from children not working. Cultural norms around girls' education were equally significant in rural areas. It's a compound barrier, not a single one.",
              },
              {
                speaker: 'Colleague',
                text: 'And what interventions showed the most promise?',
              },
              {
                speaker: 'Presenter',
                text: 'Conditional cash transfers had the strongest impact on enrolment, especially combined with school feeding programmes. But critically — the programmes that sustained gains after external funding ended were the ones with genuine community ownership. Where local leaders were involved in design from the start, outcomes were significantly better three years on.',
              },
            ],
          },
        },
      },
    ],
  },
  {
    id: 'technology',
    name: 'Technology & Innovation',
    icon: '💻',
    description: 'Discuss technological advances, their societal impacts, and the responsibilities they create.',
    frameworks: [
      {
        id: 'tech-analysis',
        name: 'Technology Analysis',
        issue: 'AI, automation, digital platforms, emerging technologies',
        description:
          'A structured approach to analysing any technology — from what it does to its future trajectory. Use when a question or passage focuses on a specific technology or innovation.',
        steps: [
          {
            label: 'Definition',
            description: 'State what the technology is, how it is broadly defined, and what problem it was created to solve.',
            vocabulary: ['defined as', 'refers to a system that', 'designed to', 'a form of'],
          },
          {
            label: 'How It Works',
            description: 'Explain the underlying mechanism — how the technology actually functions.',
            vocabulary: ['operates by', 'relies on', 'processes data through', 'enabled by', 'algorithms that'],
          },
          {
            label: 'Current Applications',
            description: 'Describe where and how the technology is being used today.',
            vocabulary: ['widely deployed in', 'adopted across', 'integrated into', 'used extensively in'],
          },
          {
            label: 'Benefits',
            description: 'Identify the genuine advantages the technology delivers.',
            vocabulary: ['significantly improves', 'reduces the time required', 'enables', 'enhances efficiency', 'democratises access to'],
          },
          {
            label: 'Drawbacks & Risks',
            description: 'Acknowledge the problems, limitations, or risks the technology introduces.',
            vocabulary: ['raises concerns about', 'may exacerbate', 'poses risks to', 'is associated with', 'displaces'],
          },
          {
            label: 'Future Trajectory',
            description: 'Consider where the technology is heading and what it might mean for society.',
            vocabulary: ['is projected to', 'will likely transform', 'emerging research suggests', 'the next generation of'],
          },
        ],
        examples: {
          speaking: {
            context: 'IELTS Speaking Part 3 — The examiner asks about artificial intelligence.',
            dialogue: [
              {
                speaker: 'Examiner',
                text: 'Do you think artificial intelligence will have a positive or negative effect on employment?',
              },
              {
                speaker: 'Candidate',
                text: "The honest answer is both — and the outcome depends largely on how we manage the transition. AI is broadly defined as the ability of machines to perform tasks that previously required human intelligence: pattern recognition, decision-making, natural language processing. In its current applications, it's already being integrated into industries from healthcare diagnostics to customer service, and it significantly improves speed and consistency in those contexts.",
              },
              {
                speaker: 'Examiner',
                text: 'But what about job losses?',
              },
              {
                speaker: 'Candidate',
                text: "That's the central concern. AI displaces routine, repetitive tasks — which disproportionately affects lower-wage workers who have fewer options to retrain. The risk isn't that technology is inherently harmful, but that without active policy intervention — retraining programmes, adjusted safety nets — the economic gains will concentrate at the top while the costs are spread across the workforce. The future trajectory really depends on whether governments treat this as a productivity story or a distribution story.",
              },
            ],
          },
          writing: {
            taskType: 'Task 2 — Discussion',
            prompt:
              'Artificial intelligence is transforming many industries. Some people believe this will create more jobs than it destroys. Others argue it will lead to widespread unemployment. Discuss both views and give your own opinion.',
            sample:
              "The debate over artificial intelligence and employment reflects a tension between optimism about productivity gains and concern about structural inequality. Proponents of AI expansion argue that, historically, technology creates as many jobs as it eliminates: the automation of routine tasks frees workers to focus on higher-value, creative, and interpersonal activities, while entirely new industries — and thus new forms of employment — emerge around each technological wave. AI is already enabling breakthroughs in medical diagnosis, logistics optimisation, and scientific research that would be impossible at human speed. Critics, however, contend that the current wave of automation is qualitatively different: AI is capable of performing not only physical tasks but cognitive ones, and the pace of displacement may outstrip society's capacity for retraining. Workers in routine data-processing, administrative, and service roles — often those with the fewest alternative options — are most exposed. In my view, the employment impact of AI is less a technological inevitability than a policy choice: with proactive investment in workforce retraining, reformed social safety nets, and carefully designed regulation, the productivity gains that AI generates can be broadly shared rather than narrowly captured.",
          },
          reading: {
            context: 'Academic article — how to follow the structure when reading about a technology.',
            passage:
              'Artificial intelligence refers to a broad set of computational techniques designed to enable machines to perform tasks that have historically required human cognition — including perception, reasoning, and language comprehension [Definition]. Contemporary AI systems operate primarily through machine learning: algorithms trained on large datasets to identify patterns and generate predictions, without being explicitly programmed for each specific task [How It Works]. These systems are now widely deployed across sectors including healthcare, where they assist in diagnostic imaging analysis, financial services, where they power fraud detection systems, and retail, where they personalise product recommendations at scale [Current Applications]. The efficiency gains are considerable: AI diagnostic tools have been shown to match or exceed specialist accuracy in identifying certain cancers, while logistics algorithms reduce delivery costs and energy consumption significantly [Benefits]. However, the technology poses substantial risks: concerns about algorithmic bias, data privacy, and the displacement of workers in routine cognitive roles are well-documented, and the concentration of AI capability in a small number of large corporations raises questions about market competition and democratic accountability [Drawbacks & Risks]. Emerging research suggests that the next generation of AI systems — capable of more generalised reasoning across domains — will accelerate both the opportunities and the risks identified in current applications, making governance frameworks established now disproportionately consequential for long-term outcomes [Future Trajectory].',
          },
          listening: {
            context: 'Technology conference talk — a researcher discusses AI and its societal implications.',
            script: [
              {
                speaker: 'Presenter',
                text: "I want to ground this in what AI actually is before we get to the implications. At its core, it's a set of algorithms trained on data to recognise patterns — it's not magic, it's statistics at scale. But the scale matters, because it means these systems can now be deployed across sectors in ways that weren't feasible a decade ago.",
              },
              {
                speaker: 'Audience member',
                text: 'What are the most significant applications right now?',
              },
              {
                speaker: 'Presenter',
                text: 'Healthcare and logistics are probably the clearest — diagnostic imaging AI is matching specialist accuracy in controlled studies, and route optimisation algorithms are already standard in global supply chains. The efficiency gains are real and significant.',
              },
              {
                speaker: 'Audience member',
                text: 'And the risks?',
              },
              {
                speaker: 'Presenter',
                text: "The ones I worry about most are distributional. The benefits concentrate among those who own or deploy the technology, while the costs — job displacement, algorithmic bias, privacy erosion — are diffused across people who have the least power to push back. The technology itself isn't the problem. The governance structures around it are what we should be urgently debating.",
              },
            ],
          },
        },
      },
      {
        id: 'tech-society',
        name: 'Technology & Society',
        issue: 'Digital dependency, privacy, social media, screen time, regulation',
        description:
          'A framework for discussing the broader social effects of technology — both what it enables and what it erodes. Use when the topic focuses on how technology shapes behaviour, relationships, or society.',
        steps: [
          {
            label: 'Current Adoption',
            description: 'Establish how embedded the technology is in everyday life — usage statistics, demographics, reach.',
            vocabulary: ['over X billion users', 'ubiquitous in', 'penetration rate', 'increasingly reliant on'],
          },
          {
            label: 'Positive Social Effects',
            description: 'Identify the genuine social benefits the technology has delivered.',
            vocabulary: ['facilitates global connection', 'democratises information', 'enables participation in', 'empowers individuals to'],
          },
          {
            label: 'Negative Social Effects',
            description: 'Examine the harms or unintended consequences for individuals and communities.',
            vocabulary: ['contributes to', 'erosion of', 'associated with increased', 'undermines', 'normalises'],
          },
          {
            label: 'Regulation & Responsibility',
            description: 'Discuss what governments, companies, and platforms should do to manage these effects.',
            vocabulary: ['regulatory frameworks', 'platform accountability', 'duty of care', 'algorithmic transparency', 'data sovereignty'],
          },
          {
            label: 'Individual Agency',
            description: 'Consider what individuals can do to maintain healthy relationships with technology.',
            vocabulary: ['digital literacy', 'conscious use', 'setting boundaries', 'critical consumption', 'digital well-being'],
          },
        ],
        examples: {
          speaking: {
            context: 'IELTS Speaking Part 3 — The examiner asks about social media and mental health.',
            dialogue: [
              {
                speaker: 'Examiner',
                text: 'Do you think social media has had a mostly positive or mostly negative effect on society?',
              },
              {
                speaker: 'Candidate',
                text: "I think the honest answer is that it depends on how it's used and by whom. For adults who use it deliberately — to connect with communities, access information, or organise professionally — the benefits are real. It facilitates global connection and democratises information in ways that weren't possible before.",
              },
              {
                speaker: 'Examiner',
                text: 'And the negatives?',
              },
              {
                speaker: 'Candidate',
                text: "They're also real, particularly for younger users. The research on social media and adolescent mental health is increasingly clear — excessive use is associated with anxiety, depression, and distorted self-perception, partly because the algorithms are designed to maximise engagement, not well-being. I think platforms need to accept a duty of care — particularly for under-18 users — and governments need regulatory frameworks with actual teeth. Individual digital literacy helps, but expecting teenagers to out-discipline an algorithm designed by teams of engineers is unrealistic.",
              },
            ],
          },
          writing: {
            taskType: 'Task 2 — Opinion (Agree/Disagree)',
            prompt:
              "Social media companies should be held legally responsible for the negative effects their platforms have on users' mental health. To what extent do you agree or disagree?",
            sample:
              'As evidence accumulates linking excessive social media use to deteriorating mental health — particularly among adolescents — the question of platform accountability has moved from academic debate to urgent policy consideration. I broadly agree that legal responsibility is appropriate, though the precise framework requires careful design. Social media platforms now reach over four billion users globally, making them infrastructure-scale institutions rather than merely optional consumer products. The engagement-maximising algorithms these platforms deploy — optimised for time-on-platform rather than user well-being — are associated with increased anxiety, depression, and, in documented cases, self-harm among younger users. Companies have demonstrated, through internal research subsequently made public, that they were aware of these harms while continuing to deploy the same mechanisms. This awareness distinguishes legal responsibility from mere regulation: it establishes the negligence standard that liability frameworks typically require. A duty of care, backed by meaningful penalties, would create genuine incentives for platforms to redesign their recommendation systems, strengthen age verification, and implement transparent algorithmic safeguards. Critics who argue this would stifle innovation conflate the freedom to create technology with the freedom to cause demonstrable harm without consequence — a conflation no other industry is permitted.',
          },
          reading: {
            context: 'Social policy report — how to follow the structure when reading about technology and society.',
            passage:
              'Social media platforms now reach in excess of four billion active users globally, with penetration rates exceeding 80% among adults in high-income countries and smartphone ownership extending their reach to demographics previously excluded from digital participation [Current Adoption]. For many users, these platforms deliver genuine social value: they facilitate connection across geographical distances, enable participation in communities organised around shared interests or identities, and have demonstrably empowered political and social movements that lacked access to traditional media [Positive Social Effects]. However, a substantial body of research documents significant harms: heavy social media use is associated with increased rates of anxiety and depression, particularly among adolescent girls, while algorithmic content recommendation contributes to the erosion of shared factual reality by prioritising emotionally engaging — often polarising — content over accuracy [Negative Social Effects]. Policymakers are increasingly considering regulatory responses, including platform accountability for content moderation, data sovereignty requirements, and algorithmic transparency obligations, though effective regulatory frameworks have proved difficult to design and enforce across jurisdictions [Regulation & Responsibility]. Researchers in digital well-being advocate for individual countermeasures — including digital literacy education, conscious use practices, and structured screen-time limits — while acknowledging that individual agency has limited effectiveness against systems engineered by large teams to maximise engagement [Individual Agency].',
          },
          listening: {
            context: 'University seminar — a lecturer discusses social media and adolescent mental health.',
            script: [
              {
                speaker: 'Lecturer',
                text: "Let's look at where the research actually lands on social media and mental health, because it's more nuanced than the headlines suggest. The overall picture for adults is mixed — there are genuine benefits to connection and information access alongside real risks around comparison and time displacement. The picture for adolescents is much clearer and more concerning.",
              },
              {
                speaker: 'Student',
                text: 'What does the research show specifically?',
              },
              {
                speaker: 'Lecturer',
                text: 'Consistent correlations between heavy use and increased anxiety and depression, particularly in girls aged 11 to 17. And the internal documents that have come out of major platforms suggest the companies knew. That shifts this from a conversation about unintended consequences to one about responsibility and governance.',
              },
              {
                speaker: 'Student',
                text: 'Can individuals just choose to use it less?',
              },
              {
                speaker: 'Lecturer',
                text: "In principle, yes. In practice, you're asking individuals to exercise consistent self-discipline against systems specifically engineered to undermine it. Digital literacy helps at the margins, but it can't substitute for regulatory frameworks that create genuine accountability at the platform level.",
              },
            ],
          },
        },
      },
    ],
  },
  {
    id: 'environment',
    name: 'Environment & Climate',
    icon: '🌍',
    description: 'Analyse environmental problems, climate science, and the policies and behaviours needed to address them.',
    frameworks: [
      {
        id: 'environmental-problem',
        name: 'Environmental Problem Analysis',
        issue: 'Pollution, deforestation, plastic waste, biodiversity loss',
        description:
          'A framework for analysing any specific environmental problem — from what is happening to how it can be addressed. Use when the topic focuses on a particular environmental issue rather than climate change broadly.',
        steps: [
          {
            label: 'Issue Description',
            description: 'Define the environmental problem clearly — what it is, where it is occurring, and at what scale.',
            vocabulary: ['at an unprecedented rate', 'currently affects', 'estimated X million tonnes', 'has increased by'],
          },
          {
            label: 'Causes',
            description: 'Identify the human activities or systems driving the problem.',
            vocabulary: ['primarily driven by', 'exacerbated by', 'industrial practices that', 'consumer behaviour including'],
          },
          {
            label: 'Environmental Consequences',
            description: 'Describe the damage to ecosystems, species, or natural systems.',
            vocabulary: ['disrupts ecosystems', 'threatens biodiversity', 'leads to soil degradation', 'contaminates water sources'],
          },
          {
            label: 'Human Consequences',
            description: 'Explain the direct and indirect effects on human health, livelihoods, and food security.',
            vocabulary: ['poses health risks', 'threatens food security', 'economic losses estimated at', 'disproportionately affects'],
          },
          {
            label: 'Solutions',
            description: 'Outline the policy, technological, and behavioural responses that can address the problem.',
            vocabulary: ['transitioning to', 'extended producer responsibility', 'circular economy', 'international agreements on'],
          },
          {
            label: 'Individual vs Collective Action',
            description: 'Distinguish between what individuals can do and what requires systemic change.',
            vocabulary: ['individual choices matter, but', 'structural change is required', 'corporate responsibility', 'government regulation alone'],
          },
        ],
        examples: {
          speaking: {
            context: 'IELTS Speaking Part 3 — The examiner asks about plastic pollution.',
            dialogue: [
              {
                speaker: 'Examiner',
                text: 'How serious do you think the problem of plastic pollution is?',
              },
              {
                speaker: 'Candidate',
                text: "Extremely serious — and I think the scale is genuinely difficult to grasp. Plastic waste is now estimated at hundreds of millions of tonnes accumulating globally, and a significant portion ends up in marine environments where it persists for centuries. It disrupts ecosystems from the smallest plankton upward, and microplastics have been found in human blood and breast milk — so the consequences are no longer just environmental, they're directly human.",
              },
              {
                speaker: 'Examiner',
                text: 'Who do you think is most responsible for solving it?',
              },
              {
                speaker: 'Candidate',
                text: "This is where I push back a little on the individualisation of the problem. Consumer behaviour matters — choosing reusable products, reducing packaging — but the structural reality is that a small number of corporations produce the majority of single-use plastic. Extended producer responsibility — making companies financially accountable for the end-of-life management of their packaging — is a far more scalable intervention than asking billions of individuals to shop differently. Both matter, but systemic change is where the leverage is.",
              },
            ],
          },
          writing: {
            taskType: 'Task 2 — Problem & Solution',
            prompt:
              'Plastic pollution is one of the most serious environmental problems facing the world today. What are the main causes of this problem, and what measures can governments and individuals take to address it?',
            sample:
              "Plastic pollution has become one of the defining environmental crises of the contemporary era, with an estimated 400 million tonnes of plastic produced annually, of which a significant proportion ends up in ecosystems — particularly marine environments — where it persists for centuries due to its non-biodegradable composition. The causes are fundamentally economic: plastic is cheap to produce and has become embedded in global supply chains and consumer habits, while the costs of its disposal are externalised onto ecosystems and public health systems rather than borne by producers. Environmental consequences include the disruption of marine food chains through microplastic ingestion, the entanglement and death of marine species, and soil contamination affecting agricultural productivity. The human consequences are increasingly direct: microplastics have been detected in human blood, lung tissue, and breast milk, with long-term health implications not yet fully understood. Effective solutions require action at multiple levels. Governments should implement extended producer responsibility frameworks — obliging manufacturers to fund the collection and processing of their packaging — alongside bans on the most unnecessary single-use plastics. Internationally, binding agreements analogous to the Montreal Protocol on ozone-depleting substances would establish shared standards across the major producing nations. At the individual level, conscious purchasing decisions and pressure on companies through consumer behaviour create complementary market signals, though the evidence suggests that structural regulation delivers significantly larger and more consistent reductions in plastic use than voluntary behaviour change alone.",
          },
          reading: {
            context: 'Environmental science article — how to follow the structure when reading about an environmental problem.',
            passage:
              "Marine plastic pollution has reached a scale that researchers now describe as a planetary boundary concern: an estimated 14 million tonnes of plastic enters the world's oceans annually, accumulating in vast gyres and settling on the deep seabed of even the most remote locations [Issue Description]. The primary drivers are industrial packaging practices, inadequate waste management infrastructure in lower-income countries, and consumer demand for single-use products whose disposal costs are not reflected in their retail price [Causes]. The ecological consequences are severe and cascading: microplastic particles are ingested by marine organisms at every level of the food chain, disrupting ecosystems from zooplankton to apex predators, while larger debris entangles and kills cetaceans, seabirds, and sea turtles at documented rates [Environmental Consequences]. The human implications are increasingly clear: microplastics have been identified in commercially important fish species consumed globally, in drinking water sources, and in human tissue samples, raising concerns about endocrine disruption and carcinogenicity that current regulatory frameworks were not designed to address [Human Consequences]. Policy responses under active consideration include extended producer responsibility legislation, international treaties on plastic production ceilings, and investment in waste management infrastructure in high-leakage regions [Solutions]. Researchers emphasise, however, that individual consumer behaviour — while valuable — cannot substitute for systemic change: the ten corporations responsible for the largest share of branded ocean plastic waste have a disproportionate capacity and responsibility to redesign their supply chains [Individual vs Collective Action].",
          },
          listening: {
            context: 'Radio documentary — a journalist reports on plastic pollution.',
            script: [
              {
                speaker: 'Narrator',
                text: "Every minute, the equivalent of a truckload of plastic enters the world's oceans. It's a figure that's hard to imagine — and the consequences are becoming increasingly hard to ignore.",
              },
              {
                speaker: 'Marine biologist',
                text: "What we're seeing in our research is contamination at every level of the marine food web. Microplastics — particles smaller than five millimetres — are being ingested by plankton, by small fish, by the larger species that feed on them. And now we're finding them in human tissue as well. The ecosystem and the human health story have merged.",
              },
              {
                speaker: 'Policy researcher',
                text: "The solutions exist — extended producer responsibility, international agreements, bans on the most egregious single-use products. The gap isn't knowledge, it's political will. And part of the reason political will is weak is that the industry has been very effective at redirecting the conversation towards individual recycling behaviour, which, while valuable, cannot address the structural production problem.",
              },
            ],
          },
        },
      },
      {
        id: 'climate-change',
        name: 'Climate Change',
        issue: 'Global warming, carbon emissions, renewable energy, international agreements',
        description:
          'A framework specifically for climate change — covering the science, the causes, the current and future impacts, and both mitigation and adaptation responses. Use when the question is directly about climate or carbon emissions.',
        steps: [
          {
            label: 'Scientific Consensus',
            description: 'Establish what the scientific community agrees on — the evidence base for climate change.',
            vocabulary: ['overwhelming scientific consensus', 'IPCC findings', 'global average temperature has risen', 'attributable to human activity'],
          },
          {
            label: 'Causes',
            description: 'Identify the primary human activities generating greenhouse gas emissions.',
            vocabulary: ['fossil fuel combustion', 'deforestation', 'agricultural methane', 'industrial emissions', 'carbon dioxide equivalent'],
          },
          {
            label: 'Current & Projected Impacts',
            description: 'Describe what is already happening and what is projected if emissions continue.',
            vocabulary: ['rising sea levels', 'increased frequency of', 'extreme weather events', 'ecosystem disruption', 'projected to exceed'],
          },
          {
            label: 'Mitigation',
            description: 'Explain actions that reduce emissions and slow the pace of climate change.',
            vocabulary: ['transition to renewables', 'carbon pricing', 'net zero targets', 'energy efficiency', 'reforestation'],
          },
          {
            label: 'Adaptation',
            description: 'Describe how societies are adjusting to the changes that are already locked in.',
            vocabulary: ['climate-resilient infrastructure', 'managed retreat', 'drought-resistant crops', 'flood defence systems'],
          },
          {
            label: 'Equity & Justice',
            description: 'Address the unequal distribution of causes and consequences across nations and communities.',
            vocabulary: ['climate justice', 'loss and damage', 'historic emitters', 'vulnerable nations', 'just transition'],
          },
        ],
        examples: {
          speaking: {
            context: 'IELTS Speaking Part 3 — The examiner asks about individual responsibility for climate change.',
            dialogue: [
              {
                speaker: 'Examiner',
                text: 'Do you think individuals or governments bear more responsibility for addressing climate change?',
              },
              {
                speaker: 'Candidate',
                text: "Governments, primarily — though I'd push back on the framing a little, because the choice between individuals and governments is somewhat false. The scientific consensus is clear: the scale of emissions reduction required to meet 1.5°C targets cannot be achieved through individual lifestyle changes alone. The fossil fuel combustion driving the majority of global emissions is embedded in energy systems, transport infrastructure, and industrial processes that individuals cannot restructure through consumer choices.",
              },
              {
                speaker: 'Examiner',
                text: 'So what should governments actually do?',
              },
              {
                speaker: 'Candidate',
                text: "Carbon pricing is probably the most broadly supported economic mechanism — putting a cost on emissions creates incentives across the whole economy simultaneously. Beyond that, accelerating the transition to renewables through regulation and investment, and meeting the commitments on climate finance to vulnerable nations that face the consequences of emissions they did not disproportionately cause. Climate justice is the part of this conversation that gets least attention but matters enormously for international cooperation.",
              },
            ],
          },
          writing: {
            taskType: 'Task 2 — Opinion (Agree/Disagree)',
            prompt:
              'The most important thing individuals can do to address climate change is to change their personal behaviour, such as reducing meat consumption and using public transport. To what extent do you agree or disagree?',
            sample:
              "While individual behaviour change has genuine value in addressing climate change, I disagree that it represents the most important lever available — and this distinction matters, because misidentifying the most effective interventions has real consequences for how societies allocate political attention and policy effort. The scientific consensus is unambiguous: global average temperatures have risen by approximately 1.1°C since pre-industrial levels, attributable to human greenhouse gas emissions, with further increases locked in by emissions already released. The causes are overwhelmingly structural: fossil fuel combustion for energy, transport, and industry; agricultural methane from livestock at industrial scale; and deforestation driven by land clearance economics. These systems cannot be dismantled through individual choice, however widespread. The projected impacts — including more frequent extreme weather events, rising sea levels, and ecosystem disruption — will continue to intensify until emissions fall at a systemic level. The most impactful interventions are therefore governmental and economic: robust carbon pricing, accelerated renewable energy deployment, and the phase-out of fossil fuel subsidies. Individual choices around diet, transport, and consumption are meaningful as both direct emissions reductions and as signals of social acceptability for policy ambition — but they function most powerfully as complements to systemic change, not substitutes for it.",
          },
          reading: {
            context: 'Climate science policy brief — how to follow the structure when reading about climate change.',
            passage:
              'The scientific consensus on anthropogenic climate change, established through decades of research synthesised by the Intergovernmental Panel on Climate Change, is unequivocal: global average surface temperatures have risen by approximately 1.1°C since the pre-industrial period, and this warming is attributable with high confidence to human activity [Scientific Consensus]. The primary drivers are fossil fuel combustion for energy and transport, industrial processes, deforestation, and agricultural emissions — with the ten highest-emitting nations responsible for approximately 70% of cumulative global emissions [Causes]. Current impacts already include increased frequency and intensity of extreme weather events, accelerating glacial retreat, rising sea levels threatening low-lying coastal populations, and ecosystem disruption across marine and terrestrial habitats; without significant emissions reductions, these trends are projected to intensify substantially by mid-century [Current & Projected Impacts]. Mitigation strategies — those that reduce emissions — include transitioning energy systems to renewables, implementing carbon pricing mechanisms, and achieving net zero targets through a combination of efficiency improvements and carbon capture [Mitigation]. Simultaneously, adaptation measures are required to manage the consequences of warming that is already committed: climate-resilient infrastructure, managed coastal retreat, drought-resistant agricultural varieties, and enhanced early warning systems for extreme weather events [Adaptation]. A dimension that receives insufficient attention in technical discussions is equity: the nations and communities most exposed to climate impacts have contributed least to cumulative emissions, raising fundamental questions about liability, loss and damage compensation, and the terms of a just transition for fossil-fuel-dependent economies [Equity & Justice].',
          },
          listening: {
            context: 'University lecture — a climate scientist presents to students.',
            script: [
              {
                speaker: 'Lecturer',
                text: "I want to start by being very clear about what the science actually says, because there's still a lot of noise in public discourse. The warming we've observed — approximately 1.1 degrees above pre-industrial levels — is attributable to human activity with a level of scientific confidence we rarely achieve on anything. The IPCC's Sixth Assessment Report represents the consensus of thousands of researchers across decades. This is not a contested finding.",
              },
              {
                speaker: 'Student',
                text: 'So what happens if we don\'t change course?',
              },
              {
                speaker: 'Lecturer',
                text: "The projections are serious. More frequent extreme weather events, sea level rise that threatens hundreds of millions of coastal residents, agricultural disruption in regions that are already food-insecure. And these impacts fall disproportionately on the nations that have emitted least historically — that's the climate justice dimension.",
              },
              {
                speaker: 'Student',
                text: 'What does effective action actually look like?',
              },
              {
                speaker: 'Lecturer',
                text: "Two parallel tracks. Mitigation — reducing emissions through renewables, carbon pricing, efficiency — to slow the rate of change. And adaptation — building resilient infrastructure, changing agricultural practices — to manage what's already locked in. We need both, simultaneously, and we needed them sooner than we are starting.",
              },
            ],
          },
        },
      },
    ],
  },
  {
    id: 'economy',
    name: 'Economy & Work',
    icon: '💼',
    description: 'Discuss economic systems, labour markets, globalisation, and the changing nature of work.',
    frameworks: [
      {
        id: 'economic-issue',
        name: 'Economic Issue Analysis',
        issue: 'Inequality, unemployment, inflation, economic growth vs sustainability',
        description:
          'A framework for analysing any economic problem — from diagnosis to policy response. Use when the topic focuses on an economic challenge or policy debate.',
        steps: [
          {
            label: 'Context',
            description: 'Establish the economic environment — the country, the phase of the economic cycle, and what is at stake.',
            vocabulary: ['in the context of', 'against a backdrop of', 'amid growing', 'characterised by'],
          },
          {
            label: 'Problem',
            description: 'Define the economic problem precisely — who is affected and to what degree.',
            vocabulary: ['disproportionately affects', 'measured by the Gini coefficient', 'unemployment rate of', 'real wage stagnation'],
          },
          {
            label: 'Causes',
            description: 'Identify the structural, cyclical, or policy factors driving the problem.',
            vocabulary: ['structural shift towards', 'driven by technological change', 'exacerbated by', 'a consequence of'],
          },
          {
            label: 'Economic Consequences',
            description: 'Explain the downstream effects on growth, productivity, social mobility, or public finances.',
            vocabulary: ['reduces consumer spending', 'dampens economic growth', 'increases fiscal pressure', 'widens inequality'],
          },
          {
            label: 'Policy Responses',
            description: 'Outline the interventions available to governments, central banks, or international bodies.',
            vocabulary: ['fiscal stimulus', 'monetary tightening', 'redistributive taxation', 'active labour market policies'],
          },
          {
            label: 'Trade-offs',
            description: 'Acknowledge the genuine tensions between competing policy objectives.',
            vocabulary: ['at the cost of', 'risks triggering', 'the tension between growth and', 'in the short term vs the long term'],
          },
        ],
        examples: {
          speaking: {
            context: 'IELTS Speaking Part 3 — The examiner asks about wealth inequality.',
            dialogue: [
              {
                speaker: 'Examiner',
                text: 'Do you think the gap between rich and poor is a serious problem in modern society?',
              },
              {
                speaker: 'Candidate',
                text: "Yes — and I think the evidence is fairly clear that beyond a certain level, inequality stops being just a moral concern and becomes an economic one. Real wage stagnation for the bottom half of earners in many high-income countries, amid significant growth in wealth at the top, has reduced consumer spending in the broader economy — because middle and lower-income households spend a higher proportion of income than the wealthy do.",
              },
              {
                speaker: 'Examiner',
                text: 'What policies might help address it?',
              },
              {
                speaker: 'Candidate',
                text: "Progressive taxation is the most direct mechanism — ensuring that capital gains are taxed comparably to labour income, for instance. Active labour market policies — retraining, subsidised childcare, investment in education — address the structural shift towards a knowledge economy that is leaving lower-skilled workers behind. The challenge is that some of the most effective interventions involve trade-offs: higher corporate taxes risk dampening investment in the short term, even if they fund public goods that improve long-term productivity. Good policy requires navigating those tensions honestly rather than pretending they don't exist.",
              },
            ],
          },
          writing: {
            taskType: 'Task 2 — Problem & Solution',
            prompt:
              'The gap between the richest and poorest members of society has been increasing in many countries. What are the causes of this trend, and what can be done to reduce inequality?',
            sample:
              'Rising economic inequality has emerged as one of the defining political and social challenges of the early twenty-first century, with wealth concentration at the top of the distribution reaching levels not seen since the pre-war period in several high-income nations. The causes are structural rather than incidental: the transition towards knowledge-intensive, technology-driven economies has disproportionately rewarded those with high levels of education and digital skills, while displacing workers in routine manual and cognitive roles. Simultaneously, the declining bargaining power of organised labour, the globalisation of production, and tax systems that have not kept pace with the mobility of capital have each contributed to real wage stagnation for the bottom half of earners. The economic consequences are significant and self-reinforcing: reduced disposable income among lower earners dampens consumer spending, constraining broader economic growth, while limited social mobility perpetuates disadvantage across generations, reducing the human capital investment that economies require. Effective policy responses include progressive taxation of both income and wealth, including the alignment of capital gains tax rates with income tax; investment in high-quality public education and vocational training that enables workers to adapt to structural economic shifts; and robust social insurance systems that provide genuine security during periods of transition. The most effective approaches combine redistribution with investment — not as competing priorities, but as mutually reinforcing components of an economy that generates and broadly shares growth.',
          },
          reading: {
            context: 'Economics journal article — how to follow the structure when reading about an economic problem.',
            passage:
              'The sustained rise in income and wealth inequality observed across most high-income economies since the 1980s has generated a substantial body of research attempting to identify its causes, consequences, and remedies. This literature emerges against a backdrop of declining union membership, increasing returns to education, and the globalisation of production — each of which has reshaped the distribution of economic gains [Context]. The problem is multidimensional: measured by the Gini coefficient, income inequality has increased in the majority of OECD nations over the past four decades, while wealth concentration — amplified by rising asset prices — has reached levels that concentrate over 50% of national wealth in the top 10% of households in several countries [Problem]. The causal literature identifies a convergent set of structural forces: skill-biased technological change that raises the relative return on high-education labour, the erosion of collective bargaining institutions that historically compressed wage distributions, and fiscal systems that have struggled to tax increasingly mobile capital income at rates comparable to labour income [Causes]. The downstream consequences include reduced intergenerational social mobility, dampened consumer demand from lower-income households, and increased fiscal pressure on public services as the tax base narrows [Economic Consequences]. Policy proposals span a spectrum from reformed capital taxation and enhanced progressive income taxes to active labour market policies, including subsidised retraining and expanded childcare, that address the structural factors generating inequality rather than merely redistributing its proceeds [Policy Responses]. Economists note genuine trade-offs, however: measures that effectively redistribute income may create disincentive effects or capital flight risks that need to be carefully managed within the design of any intervention [Trade-offs].',
          },
          listening: {
            context: 'Economics podcast — two analysts discuss wealth inequality.',
            script: [
              {
                speaker: 'Host',
                text: "Inequality is one of those topics where everyone agrees it's a problem but nobody agrees on the cause. What does the evidence actually show?",
              },
              {
                speaker: 'Economist',
                text: "The evidence points to a cluster of structural factors rather than any single cause. Technological change has increased the return on high-skill labour relative to routine work. The decline of trade unions has reduced the bargaining power of workers in the middle and bottom of the distribution. And tax systems in most countries have struggled to keep up with the mobility of capital, so capital income is often taxed less effectively than wage income. These factors compound each other.",
              },
              {
                speaker: 'Host',
                text: 'And what can realistically be done?',
              },
              {
                speaker: 'Economist',
                text: "More than people assume. Progressive taxation — including closing the gap between how labour and capital are taxed — is the most direct lever. But the more interesting policies in terms of long-run impact are on the investment side: education, retraining, childcare. These address the structural causes rather than just redistributing the proceeds. The honest caveat is that good redistribution policy does involve trade-offs, and pretending otherwise doesn't help anyone design effective interventions.",
              },
            ],
          },
        },
      },
      {
        id: 'future-of-work',
        name: 'Future of Work',
        issue: 'Automation, remote work, gig economy, work-life balance',
        description:
          'A framework for discussing how the nature of employment is changing — who works, how they work, and what protections they have. Use when the topic focuses on labour markets, working conditions, or the impact of technology on jobs.',
        steps: [
          {
            label: 'Current Landscape',
            description: 'Describe the current state of the labour market — trends in employment types, sectors, and working patterns.',
            vocabulary: ['rise of the gig economy', 'remote work normalised by', 'precarious employment', 'skills shortage in'],
          },
          {
            label: 'Disruption Forces',
            description: 'Identify what is driving change in the nature of work.',
            vocabulary: ['automation of routine tasks', 'platform capitalism', 'globalisation of talent', 'shift towards project-based'],
          },
          {
            label: 'Impacts on Workers',
            description: 'Examine the effects on different groups — both positive and negative.',
            vocabulary: ['greater flexibility', 'lack of employment security', 'erosion of benefits', 'increased autonomy for'],
          },
          {
            label: 'Employer & Industry Adaptations',
            description: 'Describe how businesses are responding to these changes.',
            vocabulary: ['hybrid working models', 'continuous upskilling', 'talent retention strategies', 'restructuring towards'],
          },
          {
            label: 'Policy Implications',
            description: 'Discuss what regulatory or policy frameworks are needed to protect workers in this new landscape.',
            vocabulary: ['portable benefits', 'right to disconnect', 'minimum income guarantee', 'platform worker classification'],
          },
        ],
        examples: {
          speaking: {
            context: 'IELTS Speaking Part 3 — The examiner asks about remote work and work-life balance.',
            dialogue: [
              {
                speaker: 'Examiner',
                text: 'Do you think the shift to remote working has been positive for employees overall?',
              },
              {
                speaker: 'Candidate',
                text: "For many, yes — but it's quite unequally distributed as an experience. For professional workers in knowledge industries, remote work has genuinely improved autonomy and eliminated commuting time, which has real quality-of-life benefits. But for gig economy workers — delivery drivers, care workers, platform labourers — the shift has meant more precarious employment, lack of benefits, and no protection whatsoever from the risks the employer used to absorb.",
              },
              {
                speaker: 'Examiner',
                text: 'Should governments intervene in how people work?',
              },
              {
                speaker: 'Candidate',
                text: "I think they have to — particularly around worker classification. Many platform companies deliberately misclassify employees as independent contractors to avoid providing employment security, sick pay, or pension contributions. Several countries have started to challenge this legally, and I think the right to disconnect — the idea that workers cannot be expected to be available outside contracted hours — is another policy area that's overdue for legal protection. The labour market is changing fast, and the regulatory framework needs to keep pace.",
              },
            ],
          },
          writing: {
            taskType: 'Task 2 — Discussion',
            prompt:
              'The rise of the gig economy has changed the nature of work for millions of people. Some believe this offers greater freedom and flexibility. Others argue it exploits workers by removing employment protections. Discuss both views and give your own opinion.',
            sample:
              "The expansion of the gig economy — characterised by platform-mediated, short-term, task-based work — has generated genuinely divergent experiences that make sweeping judgements difficult. For certain workers, particularly those seeking supplementary income, the ability to set their own hours and take on work flexibly represents a meaningful improvement over traditional employment structures. Technology-enabled platforms have, in this reading, lowered the barriers to self-employment and enabled a form of work that suits particular life circumstances — caregiving responsibilities, study, or portfolio careers. However, a more critical analysis reveals that this flexibility is frequently asymmetric: workers bear the scheduling risk, the income volatility, and the absence of sick pay, holiday entitlement, or pension provision, while platforms retain the pricing power, the algorithmic control, and — crucially — the classification decision that determines which legal protections apply. Courts in several jurisdictions have found that gig workers satisfy the substantive tests for employment status despite being formally classified as independent contractors, and subsequent reclassification decisions have forced platforms to extend basic protections. In my view, the flexibility benefits of gig work are real and worth preserving, but they should not be contingent on the elimination of basic employment security. Portable benefits systems — in which entitlements accumulate with hours worked regardless of employer — offer a model for extending protection without requiring the binary employed/self-employed classification that current law struggles to apply to platform work.",
          },
          reading: {
            context: 'Labour economics report — how to follow the structure when reading about changing work patterns.',
            passage:
              'The labour markets of high-income economies have undergone structural transformation over the past two decades, characterised by the rise of the gig economy, the normalisation of remote working accelerated by pandemic experience, and a pronounced shift away from long-tenure employment relationships towards project-based and contract arrangements [Current Landscape]. The forces driving this transformation are multiple: automation has displaced routine occupations while creating demand for higher-skill roles; platform technologies have reduced transaction costs in labour markets, enabling on-demand matching between workers and tasks; and globalisation of talent has allowed firms to recruit beyond geographical constraints [Disruption Forces]. The impacts on workers are heterogeneous and often polarised: for professionals in knowledge industries, greater flexibility and geographic freedom represent genuine improvements in working conditions and autonomy; for workers in lower-skill platform roles, the same structural shift has produced precarious income, erosion of benefits, and heightened exposure to algorithmic management without the protections of employment law [Impacts on Workers]. Employers, meanwhile, have responded by adopting hybrid working models, investing in continuous upskilling programmes, and competing more intensively on workplace culture and purpose as talent retention strategies in a market of heightened worker mobility [Employer & Industry Adaptations]. Policymakers are increasingly focused on regulatory reform: portable benefits systems that decouple entitlements from employment status, platform worker reclassification legislation, minimum income guarantees, and right-to-disconnect provisions represent the leading policy instruments under active consideration across OECD nations [Policy Implications].',
          },
          listening: {
            context: 'Business conference panel — speakers discuss the future of work.',
            script: [
              {
                speaker: 'Moderator',
                text: "The pandemic changed where we work. Technology is changing what we do. What should companies be prioritising right now?",
              },
              {
                speaker: 'HR Director',
                text: "Flexibility and purpose. The workers who have options — and increasingly that's a wider group than it used to be — are choosing organisations where the culture and the mission matter. Hybrid working isn't just a perk anymore; it's a baseline expectation in many professional sectors. Companies that resist it are losing talent to those that don't.",
              },
              {
                speaker: 'Policy researcher',
                text: "I'd add that the regulatory dimension is becoming urgent. The gig economy has created millions of workers who have all the practical characteristics of employees — algorithmic scheduling, rate-setting by the platform, economic dependency — but none of the legal protections. Courts are starting to challenge this, but legislative frameworks need to catch up. Portable benefits are probably the most practical solution — entitlements that follow the worker across engagements rather than being tied to a single employer.",
              },
            ],
          },
        },
      },
    ],
  },
  {
    id: 'society',
    name: 'Society & Culture',
    icon: '🌐',
    description: 'Explore how societies change over time, the forces shaping cultural values, and the tensions between tradition and progress.',
    frameworks: [
      {
        id: 'social-issue',
        name: 'Social Issue Analysis',
        issue: 'Crime, housing, ageing population, migration, social cohesion',
        description:
          'A general framework for analysing any social issue — from its scale and causes to its consequences and solutions. Use when the topic focuses on a problem affecting communities or social groups.',
        steps: [
          {
            label: 'Scale & Context',
            description: 'Establish how significant the issue is and in what social context it occurs.',
            vocabulary: ['affects an estimated', 'has increased significantly in', 'particularly acute in', 'a growing concern among'],
          },
          {
            label: 'Contributing Factors',
            description: 'Identify the social, economic, or structural factors that cause or worsen the issue.',
            vocabulary: ['rooted in', 'perpetuated by', 'compounded by', 'a consequence of structural'],
          },
          {
            label: 'Affected Groups',
            description: 'Specify who is most impacted and why.',
            vocabulary: ['disproportionately affects', 'particularly vulnerable are', 'those least able to', 'marginalised communities'],
          },
          {
            label: 'Social Consequences',
            description: 'Describe the broader effects on community cohesion, quality of life, or social trust.',
            vocabulary: ['erodes social cohesion', 'undermines public trust', 'increases social fragmentation', 'widens existing divides'],
          },
          {
            label: 'Policy & Community Solutions',
            description: 'Outline evidence-based interventions at both the policy and community level.',
            vocabulary: ['targeted investment in', 'community-led approaches', 'cross-agency coordination', 'preventive rather than punitive'],
          },
        ],
        examples: {
          speaking: {
            context: 'IELTS Speaking Part 3 — The examiner asks about migration and social cohesion.',
            dialogue: [
              {
                speaker: 'Examiner',
                text: 'Do you think high levels of immigration create problems for social cohesion?',
              },
              {
                speaker: 'Candidate',
                text: "The evidence suggests the relationship is more nuanced than that framing implies. In communities where integration support is well-funded — language programmes, housing that avoids residential segregation, recognition of foreign qualifications — cultural diversity tends to enrich rather than fragment social life. The problems arise when immigration is rapid relative to the infrastructure capacity of the receiving community, and when integration policy is underfunded or absent.",
              },
              {
                speaker: 'Examiner',
                text: 'So what should governments prioritise?',
              },
              {
                speaker: 'Candidate',
                text: "Preventive investment rather than reactive management. The communities where migration has created the most tension are generally those with pre-existing pressures — housing shortages, underfunded public services — where new arrivals are perceived as competing for scarce resources. Addressing those underlying pressures through targeted investment in housing and services matters as much as integration policy specifically. Social cohesion is harder to build in communities that feel economically left behind regardless of migration.",
              },
            ],
          },
          writing: {
            taskType: 'Task 2 — Discussion',
            prompt:
              'Some people argue that immigration has a negative impact on the social cohesion of host countries. Others believe it enriches society culturally and economically. Discuss both views and give your own opinion.',
            sample:
              "The debate over immigration's effect on social cohesion reflects genuine complexity that simplistic arguments on either side tend to obscure. Those who argue that high immigration levels strain social cohesion point to empirical evidence from communities where rapid demographic change has coincided with declining social trust and increased friction around shared institutions — schools, housing, and public services. When integration infrastructure is underfunded, cultural and linguistic barriers can fragment community life and generate resentment, particularly in areas where receiving populations already experience economic insecurity. Conversely, those who emphasise immigration's social and economic benefits note that diverse societies consistently demonstrate greater creativity, innovation, and economic dynamism than homogeneous ones. Where integration is well-supported, migrants contribute to social capital, fill critical skills gaps, and — across generations — become fully embedded in the cultural fabric of their host nation. The historical record of every major immigrant-receiving nation supports this view in the long run, even where short-term frictions occur. In my view, the question is less about immigration itself than about the conditions under which it occurs: well-funded integration programmes, housing policies that prevent residential segregation, and economic conditions that ensure migrants are perceived as contributors rather than competitors each determine whether diversity enriches or strains social life. The failure mode is not diversity; it is the failure to invest in the infrastructure that makes diversity work.",
          },
          reading: {
            context: 'Sociology article — how to follow the structure when reading about a social issue.',
            passage:
              'Housing affordability has emerged as a defining social challenge across major urban centres in high-income countries, with the proportion of household income devoted to housing costs reaching historically high levels among renters in cities including London, Sydney, and San Francisco [Scale & Context]. The crisis is rooted in a structural mismatch between supply and demand: restrictive planning regulations, land value dynamics that make new development profitable only at price points inaccessible to middle-income households, and the financialisation of residential property as an investment asset class have each constrained affordable supply [Contributing Factors]. While the crisis affects a broad range of urban residents, it is particularly acute for younger adults, single-parent households, and workers in essential services whose employment requires proximity to high-cost urban centres — groups least able to absorb cost increases or exercise residential choice [Affected Groups]. The social consequences extend beyond individual financial hardship: housing insecurity is associated with increased psychological distress, reduced investment in education, higher residential mobility that undermines community formation, and spatial sorting that deepens economic segregation within cities [Social Consequences]. Evidence-based policy responses include inclusionary zoning requirements that mandate affordable units within new developments, direct public investment in social housing at scale, and planning reform that enables higher-density development around transport hubs — complemented by community-led housing cooperatives that build resident ownership and stability in historically marginalised neighbourhoods [Policy & Community Solutions].',
          },
          listening: {
            context: 'Community forum — residents discuss housing and social cohesion in their neighbourhood.',
            script: [
              {
                speaker: 'Facilitator',
                text: "We're here to talk about how the neighbourhood is changing and what that means for the community. Who wants to start?",
              },
              {
                speaker: 'Resident 1',
                text: "What I notice is that people don't stay as long as they used to. Rents keep going up, people move on after a year or two, and it's hard to build the kind of networks that used to exist here. Social cohesion takes time — it requires people actually staying.",
              },
              {
                speaker: 'Community worker',
                text: "That's exactly what the research shows. Residential instability is one of the strongest predictors of reduced social trust and community engagement. And it disproportionately affects younger families and lower-income households who don't have the option to buy. The housing question and the community cohesion question are the same question.",
              },
              {
                speaker: 'Resident 2',
                text: "So what can actually be done? It feels like the problem is too structural for anything local to matter.",
              },
              {
                speaker: 'Community worker',
                text: "Local action matters — community land trusts, housing cooperatives, advocacy for inclusionary planning. But you're right that the structural causes require policy responses at scale. The two levels need to work together.",
              },
            ],
          },
        },
      },
      {
        id: 'cultural-change',
        name: 'Tradition vs Modernity',
        issue: 'Globalisation of culture, generational values, social norms, identity',
        description:
          'A framework for discussing how cultures evolve and what is gained and lost in the process. Use when the topic focuses on changing values, generational conflict, or the tension between cultural preservation and social progress.',
        steps: [
          {
            label: 'Tradition & Its Value',
            description: 'Acknowledge what traditional practices, values, or structures provide to communities.',
            vocabulary: ['provides continuity', 'shared cultural identity', 'intergenerational transmission', 'sense of belonging'],
          },
          {
            label: 'Forces of Change',
            description: 'Identify what is driving shifts in cultural values or practices.',
            vocabulary: ['globalisation has accelerated', 'urbanisation disrupts', 'digital culture normalises', 'generational shifts in'],
          },
          {
            label: 'What Is Gained',
            description: 'Consider the genuine benefits that come from cultural evolution and openness to change.',
            vocabulary: ['greater individual freedom', 'exposure to diverse perspectives', 'dismantling of harmful norms', 'social progress including'],
          },
          {
            label: 'What Is Lost',
            description: 'Acknowledge what is sacrificed or eroded through rapid cultural change.',
            vocabulary: ['loss of community bonds', 'erosion of local languages', 'displacement of traditional knowledge', 'cultural homogenisation'],
          },
          {
            label: 'Balance & Negotiation',
            description: 'Explore how societies can navigate change while maintaining meaningful continuity.',
            vocabulary: ['cultural adaptation', 'selective preservation', 'intercultural dialogue', 'communities retaining agency over'],
          },
        ],
        examples: {
          speaking: {
            context: 'IELTS Speaking Part 3 — The examiner asks about globalisation and cultural identity.',
            dialogue: [
              {
                speaker: 'Examiner',
                text: 'Do you think globalisation is making cultures around the world more similar?',
              },
              {
                speaker: 'Candidate',
                text: "In some respects, yes — particularly in consumer culture, media, and the values transmitted by digital platforms, which tend to reflect the dominant culture of wherever the technology originates. There's a real risk of cultural homogenisation, and with it the loss of linguistic diversity and traditional knowledge that took generations to develop.",
              },
              {
                speaker: 'Examiner',
                text: 'Is that necessarily a bad thing?',
              },
              {
                speaker: 'Candidate',
                text: "Not entirely — that's what makes this genuinely complex. Globalisation has also accelerated the dismantling of practices that many communities had maintained through tradition but which caused harm, particularly around gender roles and individual rights. The question is who gets to decide which cultural elements are preserved and which are revised. Communities retaining agency over that process — rather than having change imposed by economic forces they can't influence — is probably the most important factor in whether cultural evolution feels like progress or loss.",
              },
            ],
          },
          writing: {
            taskType: 'Task 2 — Discussion',
            prompt:
              'As countries become more economically developed, they tend to lose their traditional cultures and practices. Do you think the advantages of this outweigh the disadvantages?',
            sample:
              'Economic development is frequently accompanied by cultural change, as urbanisation, education expansion, and integration into global markets alter the conditions in which traditional practices were developed and sustained. Whether the resulting cultural shifts represent progress or loss depends substantially on which traditions are examined and from whose perspective. The advantages of cultural evolution accompanying development are real: rising educational attainment is associated with greater individual freedom, particularly for women and marginalised groups whose life options were constrained by traditional social structures; exposure to diverse cultural perspectives through travel, media, and migration enriches the creative and intellectual life of societies; and the dismantling of practices harmful to individuals — child marriage, caste discrimination, gender-based restrictions — represents genuine social progress. The disadvantages are equally real, however: linguistic diversity is declining globally, with thousands of indigenous languages at risk of extinction within this century; traditional ecological knowledge — accumulated over generations and often highly adapted to local conditions — is frequently lost before it can be documented; and the cultural homogenisation driven by global media tends to reflect the values of a narrow set of dominant economies rather than the diverse range of human experience. In my view, the framing of advantages versus disadvantages is less useful than asking how societies can navigate change while retaining meaningful agency over which elements of their cultural heritage they preserve, adapt, or discard — a process that goes better when driven from within than when imposed by external economic forces.',
          },
          reading: {
            context: 'Cultural studies essay — how to follow the structure when reading about cultural change.',
            passage:
              'Traditional practices — whether in the form of craft knowledge, oral narrative, ceremonial observance, or agricultural technique — provide communities with continuity across generations and a shared cultural identity that anchors individual and collective meaning [Tradition & Its Value]. The forces reshaping these practices in the contemporary era are multiple and reinforcing: economic globalisation integrates local markets into global value chains that reward standardisation over distinctiveness; urbanisation concentrates populations in settings where traditional practices lose their functional context; and digital culture, dominated by platforms originating in a small number of high-income countries, normalises values and aesthetic preferences that reflect those origins [Forces of Change]. The social changes accompanying development have brought measurable gains: expanded access to education, healthcare, and economic opportunity; greater individual freedom, particularly in societies where traditional structures constrained the rights of women or marginalised groups; and exposure to a diversity of perspectives that enriches creative and intellectual life [What Is Gained]. These gains coexist, however, with documented losses: UNESCO estimates that approximately 40% of the world\'s approximately 7,000 languages are endangered, with each extinction representing the loss of an irreplaceable system for encoding knowledge about the natural world, human relationships, and cultural identity [What Is Lost]. The most generative responses involve neither the uncritical embrace of change nor the defensive preservation of tradition, but intercultural dialogue in which communities retain meaningful agency over how their cultural heritage is adapted, shared, and transmitted to subsequent generations [Balance & Negotiation].',
          },
          listening: {
            context: 'Cultural documentary — two speakers discuss globalisation and local culture.',
            script: [
              {
                speaker: 'Narrator',
                text: 'Across the world, the same logos appear on the same high streets, the same streaming platforms deliver the same content, and younger generations navigate increasingly similar aspirations. But is globalisation erasing cultural diversity — or just reshaping it?',
              },
              {
                speaker: 'Cultural anthropologist',
                text: 'The picture is more complex than the "globalisation destroys culture" narrative suggests. What we observe empirically is cultural mixing and adaptation, not simple replacement. But there are genuine losses — particularly of indigenous languages and the knowledge systems embedded in them. When a language disappears, we lose a way of understanding the world that cannot be recovered.',
              },
              {
                speaker: 'Young activist',
                text: "I think what my generation is actually doing is selective. We adopt some global cultural forms while intensifying our attachment to specific local identities that feel meaningful to us. It's not passive cultural absorption — it's active negotiation. The real problem is when that negotiation happens on unequal terms, when global economic forces make certain cultural paths economically viable and others not.",
              },
            ],
          },
        },
      },
    ],
  },
  {
    id: 'media',
    name: 'Media & Communication',
    icon: '📱',
    description: 'Analyse how information is created, distributed, and consumed — and the social effects of media at scale.',
    frameworks: [
      {
        id: 'media-impact',
        name: 'Media Impact Analysis',
        issue: 'News media, advertising, entertainment, journalism, press freedom',
        description:
          'A framework for evaluating the influence of any media form — from what it does well to the responsibilities it carries. Use when the topic focuses on how media shapes public opinion, behaviour, or culture.',
        steps: [
          {
            label: 'Medium & Reach',
            description: 'Define the media form and establish its scale of influence.',
            vocabulary: ['reaches approximately', 'consumed by', 'the dominant platform for', 'penetration rate of'],
          },
          {
            label: 'Agenda-Setting Role',
            description: 'Explain how the medium shapes what topics people think about and how they think about them.',
            vocabulary: ['frames public discourse', 'determines the prominence of', 'narrative control', 'agenda-setting function'],
          },
          {
            label: 'Positive Effects',
            description: 'Identify the genuine public goods the medium provides.',
            vocabulary: ['informs citizens', 'holds power to account', 'enables democratic participation', 'platform for marginalised voices'],
          },
          {
            label: 'Negative Effects',
            description: 'Examine the harms the medium can cause or facilitate.',
            vocabulary: ['spreads misinformation', 'sensationalises', 'amplifies division', 'commercial pressures distort'],
          },
          {
            label: 'Regulation & Accountability',
            description: 'Discuss what frameworks ensure the medium serves public interest rather than narrow interests.',
            vocabulary: ['press freedom', 'regulatory independence', 'right of reply', 'media plurality', 'editorial standards'],
          },
        ],
        examples: {
          speaking: {
            context: 'IELTS Speaking Part 3 — The examiner asks about the role of social media in news consumption.',
            dialogue: [
              {
                speaker: 'Examiner',
                text: 'Do you think social media has improved or worsened the quality of public information?',
              },
              {
                speaker: 'Candidate',
                text: "Worsened it on balance, though I recognise it's complicated. Social media reaches billions of people and has genuinely democratised access to information and given platforms to voices that traditional media ignored. But the business model — engagement-driven advertising — creates perverse incentives: content that provokes strong emotional reactions spreads further, and misinformation tends to be more emotionally compelling than accurate information.",
              },
              {
                speaker: 'Examiner',
                text: 'Should social media be more regulated?',
              },
              {
                speaker: 'Candidate',
                text: "Yes, though the challenge is doing it without restricting the genuine public benefits. I think the most defensible approach is to regulate the algorithm rather than the content — requiring transparency about how content is amplified, and holding platforms accountable for the spread of demonstrably false health and electoral information. Press freedom is a genuine value, but the argument that it protects viral misinformation on private commercial platforms is a stretch.",
              },
            ],
          },
          writing: {
            taskType: 'Task 2 — Opinion (Agree/Disagree)',
            prompt: 'The influence of the media on society is overwhelmingly negative. To what extent do you agree or disagree?',
            sample:
              "While the media — particularly in its digital, social forms — poses genuine risks to public discourse, I disagree that its influence is overwhelmingly negative. The argument requires us to distinguish between different media forms and to weigh their contributions honestly. Investigative journalism remains one of the most powerful mechanisms for holding governments and corporations accountable to the public interest: documented cases of corruption, environmental violation, and abuse of power that would otherwise remain concealed have been exposed through sustained journalistic investigation. Public service broadcasting, in systems where editorial independence is genuinely protected, informs democratic decision-making at scale in ways no other institution can replicate. The concerning picture, however, is clear in the social media dimension: platforms whose revenue depends on maximising engagement have strong commercial incentives to amplify emotionally provocative content, which correlates with misinformation and divisive framing. The public health consequences — demonstrated during the COVID-19 pandemic, when viral misinformation contributed to demonstrable harm — and the democratic consequences — documented in the role of targeted political advertising in distorting electoral discourse — are not speculative. The conclusion I draw is not that media influence is overwhelmingly negative, but that the governance frameworks surrounding digital media are inadequate to its scale and power. Strengthening those frameworks — without compromising the press freedom on which accountability journalism depends — is the policy challenge, not abandoning the medium.",
          },
          reading: {
            context: 'Media studies report — how to follow the structure when reading about media influence.',
            passage:
              'Television news remains the primary source of information for majorities in most high-income nations, though its audience share is declining as younger demographics migrate to digital and social platforms, which now reach approximately five billion users globally [Medium & Reach]. The agenda-setting function of dominant media — their capacity to determine not only what issues citizens think about but the frames within which those issues are understood — is among the most consistently documented findings in media research: sustained coverage of an issue demonstrably increases public salience and political attention, while issues receiving minimal coverage tend not to generate public or legislative response regardless of their objective significance [Agenda-Setting Role]. High-quality journalism delivers clear public goods: investigative reporting that holds institutions accountable, fact-based coverage that enables informed democratic participation, and platforms for perspectives that would otherwise be marginalised in political and cultural life [Positive Effects]. The negative dimensions are equally documented: commercial pressures in print and broadcast media drive sensationalism and false balance; social media algorithms amplify emotionally engaging content irrespective of accuracy, spreading misinformation at speeds and scales that correction mechanisms cannot match; and concentrated media ownership creates risks of partisan editorial direction at the expense of public interest journalism [Negative Effects]. Effective governance frameworks combine strong protections for editorial independence with regulatory requirements around media plurality, transparent ownership disclosure, and — increasingly — algorithmic accountability for the content amplification decisions made by platform operators [Regulation & Accountability].',
          },
          listening: {
            context: 'Journalism school lecture — a senior editor speaks to students about media responsibility.',
            script: [
              {
                speaker: 'Editor',
                text: "I want to start with something that might sound obvious but is worth saying clearly: the media industry is not monolithic. Investigative journalism and algorithm-driven social content are not the same thing, and conflating them in debates about media responsibility does a disservice to both.",
              },
              {
                speaker: 'Student',
                text: "But don't they operate in the same information environment? Doesn't social media undercut the impact of good journalism?",
              },
              {
                speaker: 'Editor',
                text: "That's a fair challenge. Yes — the fracture of the information environment means that accurate reporting now competes for attention against viral misinformation, often losing in the short term. The accountability function of journalism depends on people reading the investigation, and that's harder when the algorithm deprioritises long-form content in favour of outrage. Which is why the regulatory question about how platforms amplify content is, in my view, the most important media policy question of this generation. Not what's published — but what's boosted, and by whom, and on what basis.",
              },
            ],
          },
        },
      },
      {
        id: 'misinformation',
        name: 'Information & Misinformation',
        issue: 'Fake news, echo chambers, deepfakes, digital literacy, conspiracy theories',
        description:
          'A framework specifically for the spread of false or misleading information in the digital era — how it happens, why it succeeds, and how it can be addressed. Use when the topic focuses on truth, trust, or information quality.',
        steps: [
          {
            label: 'Information Landscape',
            description: 'Describe the current media environment in which information competes for attention.',
            vocabulary: ['information overload', 'attention economy', 'filter bubbles', 'algorithmic curation'],
          },
          {
            label: 'How Misinformation Spreads',
            description: 'Explain the mechanisms by which false information travels and gains credibility.',
            vocabulary: ['emotional resonance', 'shares outpace corrections', 'network effects', 'social proof', 'repeated exposure'],
          },
          {
            label: 'Why It Succeeds',
            description: 'Identify the cognitive and social factors that make people susceptible to misinformation.',
            vocabulary: ['confirmation bias', 'motivated reasoning', 'tribal identity', 'trust deficit in institutions'],
          },
          {
            label: 'Consequences',
            description: 'Describe the real-world harms caused by the spread of misinformation.',
            vocabulary: ['public health risks', 'electoral integrity', 'erosion of trust in', 'violence incited by'],
          },
          {
            label: 'Solutions',
            description: 'Outline interventions at platform, policy, education, and individual levels.',
            vocabulary: ['media literacy education', 'algorithmic accountability', 'prebunking strategies', 'independent fact-checking', 'friction mechanisms'],
          },
        ],
        examples: {
          speaking: {
            context: 'IELTS Speaking Part 3 — The examiner asks about misinformation and public trust.',
            dialogue: [
              {
                speaker: 'Examiner',
                text: 'How serious do you think the problem of misinformation is for society?',
              },
              {
                speaker: 'Candidate',
                text: "Extremely serious — and I think the COVID-19 pandemic gave us a very concrete demonstration of the stakes. Vaccine misinformation spread through social networks at a speed that correction mechanisms simply couldn't match, and it contributed to measurable hesitancy that cost lives. The mechanism is well-understood: false information tends to be more emotionally resonant than accurate information, and in an attention economy, emotional engagement is what gets amplified.",
              },
              {
                speaker: 'Examiner',
                text: 'What can be done to address it?',
              },
              {
                speaker: 'Candidate',
                text: "Several things at different levels. Platforms need algorithmic accountability — transparency about what gets amplified and friction mechanisms that slow the spread of unverified content during breaking news events. Education systems need to build media literacy from early ages — not just teaching what to think, but how to evaluate sources and recognise manipulation. And prebunking strategies — exposing people to the techniques of misinformation before they encounter specific false claims — have shown promising results in reducing susceptibility. It's a problem that requires all of these simultaneously, because no single intervention is sufficient.",
              },
            ],
          },
          writing: {
            taskType: 'Task 2 — Problem & Solution',
            prompt:
              'The spread of misinformation online has become a serious problem for modern society. What are the main causes of this problem, and what measures can be taken to address it?',
            sample:
              "The proliferation of digital misinformation has emerged as one of the defining challenges of the information age, with demonstrable consequences for public health decisions, electoral integrity, and social cohesion. The causes are structural rather than incidental: the attention economy that underpins advertising-funded digital platforms creates strong incentives to amplify content that generates emotional engagement — and misinformation, typically more emotionally resonant than nuanced accurate information, thrives in this environment. Algorithmic curation further compounds the problem by creating filter bubbles in which users are disproportionately exposed to content that confirms existing beliefs, reducing the corrective exposure to contradictory evidence that might otherwise moderate susceptibility. At the cognitive level, confirmation bias and motivated reasoning make individuals selectively receptive to claims that align with existing beliefs, while declining institutional trust means that corrections from official sources are often dismissed as evidence of the conspiracy rather than refutations of it. The consequences are concrete: during the COVID-19 pandemic, vaccine misinformation contributed to measurable hesitancy; online electoral misinformation has been linked to reduced voter confidence and, in documented cases, to incitement of political violence. Effective responses require action across multiple levels. Platforms should implement algorithmic accountability measures — transparency about amplification decisions, friction mechanisms that slow viral spread during unverified breaking news events, and demotion of consistently inaccurate sources. Education systems should embed media literacy across the curriculum, with particular emphasis on prebunking techniques — exposing learners to the rhetorical strategies used in misinformation before they encounter specific false claims. Independent fact-checking ecosystems require sustained funding, and regulatory frameworks should distinguish between protecting free expression and providing commercial immunity for the deliberate amplification of demonstrably false content.",
          },
          reading: {
            context: 'Digital media research paper — how to follow the structure when reading about misinformation.',
            passage:
              'The contemporary information landscape is characterised by unprecedented volume, speed, and personalisation: billions of users receive algorithmically curated streams of content in which editorial judgement has been substantially replaced by engagement optimisation, creating conditions in which information of vastly different quality and accuracy competes on equal aesthetic and structural terms [Information Landscape]. Within this environment, misinformation spreads through well-documented mechanisms: false claims that generate strong emotional responses — particularly anger and fear — are shared at rates that consistently outpace factual corrections; repeated exposure through network connections creates a familiarity effect that increases perceived credibility; and the social proof signals embedded in platform interfaces — likes, shares, comment counts — function as credibility proxies regardless of factual accuracy [How Misinformation Spreads]. Individual susceptibility is explained by a convergent set of cognitive factors: confirmation bias leads users to evaluate information according to its consistency with prior beliefs rather than its evidentiary quality; motivated reasoning extends this selective processing to the active discounting of contradictory evidence; and declining institutional trust means that corrections from governments, scientists, and established media are themselves frequently reinterpreted as evidence of the conspiracies they seek to refute [Why It Succeeds]. The documented consequences span domains: vaccine misinformation has been causally linked to declining immunisation rates in multiple national contexts; electoral misinformation has reduced confidence in democratic institutions and, in extreme cases, incited political violence; and the generalised erosion of shared factual reality complicates the social consensus that democratic governance requires [Consequences]. Proposed interventions include algorithmic accountability requirements, prebunking educational programmes, independent fact-checking infrastructure, and platform-level friction mechanisms — each addressing a different stage in the misinformation supply chain [Solutions].',
          },
          listening: {
            context: 'Science communication podcast — a researcher discusses why misinformation is so hard to correct.',
            script: [
              {
                speaker: 'Host',
                text: "We keep hearing that fact-checking doesn't work. Is that actually true?",
              },
              {
                speaker: 'Researcher',
                text: "It's more accurate to say it's insufficient on its own. The problem is timing and reach. By the time a correction is published, the original claim has often reached ten times the audience. And there's a psychological dimension: corrections from institutional sources are often less trusted than the original claim, particularly among audiences who already distrust those institutions.",
              },
              {
                speaker: 'Host',
                text: 'So what does work?',
              },
              {
                speaker: 'Researcher',
                text: "Prebunking is showing strong results — inoculating people against misinformation techniques before they encounter specific false claims. If you understand how emotional manipulation and false authority work as rhetorical strategies, you're more resistant to specific instances. Platform-level friction — adding small delays or prompts before sharing unverified content — also reduces impulsive spreading without restricting what can be published. Neither is a complete solution, but together they address different parts of the problem in ways that retroactive correction can't.",
              },
            ],
          },
        },
      },
    ],
  },
  {
    id: 'government',
    name: 'Government & Policy',
    icon: '🏛️',
    description: 'Discuss how governments make decisions, the challenges of democratic governance, and the role of policy in addressing social problems.',
    frameworks: [
      {
        id: 'policy-analysis',
        name: 'Policy Analysis',
        issue: 'Any government policy: taxation, welfare, housing, education spending, regulation',
        description:
          'A framework for evaluating any government policy — from the problem it addresses to its trade-offs and outcomes. Use when the topic focuses on a specific law, regulation, or government programme.',
        steps: [
          {
            label: 'Problem Being Addressed',
            description: 'Define the specific problem the policy is designed to solve and why it requires government intervention.',
            vocabulary: ['market failure', 'public good', 'externality', 'the state has a legitimate role in'],
          },
          {
            label: 'Policy Objectives',
            description: 'State what the policy is trying to achieve — the measurable outcomes it is designed to produce.',
            vocabulary: ['aims to reduce', 'intended to increase', 'designed to ensure', 'targets a reduction in'],
          },
          {
            label: 'Proposed Measures',
            description: 'Describe the specific mechanisms or instruments the policy uses.',
            vocabulary: ['through regulation', 'via incentive structures', 'by mandating', 'through redistributive transfers'],
          },
          {
            label: 'Stakeholders Affected',
            description: 'Identify who benefits, who bears costs, and who has power over implementation.',
            vocabulary: ['disproportionately benefits', 'burden falls on', 'implementation depends on', 'resisted by'],
          },
          {
            label: 'Trade-offs & Outcomes',
            description: 'Acknowledge the genuine tensions and evaluate the likely or actual outcomes.',
            vocabulary: ['at the cost of', 'unintended consequences include', 'evidence from similar policies suggests', 'in the short term vs long term'],
          },
        ],
        examples: {
          speaking: {
            context: 'IELTS Speaking Part 3 — The examiner asks about government taxation policy.',
            dialogue: [
              {
                speaker: 'Examiner',
                text: 'Do you think governments should use high taxes to reduce inequality?',
              },
              {
                speaker: 'Candidate',
                text: "Yes, as part of a broader approach — though the design matters enormously. Progressive income taxation is well-established: those with higher incomes pay higher marginal rates, which reduces post-tax inequality without directly disincentivising work for most earners. The more interesting policy debate is about capital gains — wealth accumulated through asset appreciation is typically taxed at lower rates than income from work, which tends to benefit those who are already wealthy most.",
              },
              {
                speaker: 'Examiner',
                text: "But doesn't high taxation reduce economic growth?",
              },
              {
                speaker: 'Candidate',
                text: "That's the central trade-off, and the empirical evidence is more equivocal than the political debate suggests. Some high-tax countries — the Nordic economies — have sustained strong growth alongside high redistribution. The evidence suggests what matters is how tax revenue is spent: if it funds high-quality education, healthcare, and infrastructure, the productive capacity of the economy is enhanced in ways that can offset the disincentive effects. The risk of poorly designed taxation is real, but the assumption that lower taxes always produce stronger growth is not well-supported by comparative evidence.",
              },
            ],
          },
          writing: {
            taskType: 'Task 2 — Opinion (Agree/Disagree)',
            prompt:
              'Governments should spend more money on public services such as education and healthcare rather than on defence and military capability. To what extent do you agree or disagree?',
            sample:
              "The allocation of government expenditure between public services and defence reflects a genuine tension between competing legitimate priorities, and while I broadly agree that many governments could beneficially shift resources towards education and healthcare, the argument requires qualification. The case for prioritising social investment is substantive: high-quality public education is among the most well-evidenced drivers of long-term economic productivity, social mobility, and civic participation, while universal healthcare reduces both individual suffering and the economic costs of preventable illness and premature labour force exit. Countries that have sustained high investment in these areas — particularly in Northern Europe — demonstrate that the returns on social expenditure, measured in human development and economic competitiveness, are considerable. Defence spending serves a different function: it addresses a state's obligation to protect its citizens from external threats, a public good that market mechanisms cannot provide. The appropriate level of defence expenditure is properly determined by geopolitical context, threat assessment, and treaty obligations — not by comparison with social spending priorities, since these budgetary decisions exist in different analytical frameworks. The strongest version of the argument for social priority is empirical: for many middle-income democracies, evidence suggests that current defence allocations exceed what strategic analysis justifies, while social service underfunding generates costs — in reduced productivity, increased inequality, and declining social trust — that are ultimately more damaging to national security than marginal reductions in military capability.",
          },
          reading: {
            context: 'Public policy case study — how to follow the structure when reading about a government policy.',
            passage:
              'The introduction of congestion pricing in major urban centres represents one of the most studied and debated policy interventions in urban transport, offering a clear case study in how governments address market failures — in this instance, the failure of road users to bear the full social costs of their travel decisions [Problem Being Addressed]. The policy objective in each implementation has been consistent: to reduce traffic volume in congested zones during peak periods, thereby improving journey times, reducing emissions, and generating revenue for public transport investment [Policy Objectives]. The mechanism is direct: vehicles entering designated zones during specified hours are charged a variable fee, typically higher during peak demand periods, implemented via automatic number plate recognition technology [Proposed Measures]. The policy has predictably uneven distributional effects: higher-income commuters bear the financial cost most easily and are most likely to adapt by adjusting travel time or mode rather than reducing travel; lower-income workers who depend on private vehicles and cannot adjust work schedules bear the proportional burden most heavily, a concern that has shaped opposition in several cities [Stakeholders Affected]. Outcome evidence from Stockholm, London, and Singapore — the three most mature implementations — consistently shows significant reductions in congestion and emissions, with Stockholm experiencing a 20% reduction in traffic volume following permanent implementation; however, the regressive distributional impact has prompted policy designers to earmark revenue for targeted transport subsidies for lower-income residents, an adaptation that addresses the equity trade-off while preserving the efficiency gain [Trade-offs & Outcomes].',
          },
          listening: {
            context: 'Policy seminar — analysts discuss a proposed housing policy.',
            script: [
              {
                speaker: 'Moderator',
                text: "The government has proposed mandatory inclusionary zoning — requiring that 20% of units in any new development above a certain size be offered at below-market rents. What's your assessment?",
              },
              {
                speaker: 'Policy analyst',
                text: "It addresses a real problem — the market failure that produces almost no affordable housing in high-demand urban areas without intervention — and the objective is clearly stated: increase the stock of genuinely affordable units within mixed-income neighbourhoods rather than concentrating affordable housing in peripheral locations.",
              },
              {
                speaker: 'Developer representative',
                text: "The concern from our side is viability. If the affordable requirement is set too high relative to development economics, it makes some schemes financially unworkable, which reduces overall supply — including market-rate supply — and may produce fewer total units than a less restrictive approach.",
              },
              {
                speaker: 'Policy analyst',
                text: "That's a legitimate trade-off to acknowledge. The evidence from cities with longstanding inclusionary requirements suggests the viability concern is real but manageable if the policy is calibrated to local development economics. The places where it's worked well combine the affordability mandate with density bonuses — developers can build more units than baseline zoning allows, which offsets the revenue cost of the affordable component.",
              },
            ],
          },
        },
      },
    ],
  },
  {
    id: 'science',
    name: 'Science & Research',
    icon: '🔬',
    description: 'Explore scientific discovery, the relationship between science and society, and the ethical questions raised by research.',
    frameworks: [
      {
        id: 'scientific-development',
        name: 'Scientific Development',
        issue: 'Medical research, space exploration, genetic engineering, nuclear energy, scientific funding',
        description:
          'A framework for discussing any scientific or technological development — from what it is to its ethical implications. Use when the topic focuses on a scientific breakthrough, research field, or technology that raises ethical questions.',
        steps: [
          {
            label: 'Discovery & Context',
            description: 'Introduce the scientific development and the problem or question it addresses.',
            vocabulary: ['pioneered by', 'addresses the challenge of', 'represents a breakthrough in', 'builds on decades of research into'],
          },
          {
            label: 'Mechanism',
            description: 'Explain how it works in accessible terms.',
            vocabulary: ['operates by', 'exploits the property of', 'relies on', 'the process involves'],
          },
          {
            label: 'Current Applications',
            description: 'Describe where it is already being used and what benefits it has delivered.',
            vocabulary: ['already applied in', 'clinical trials demonstrate', 'deployed commercially in', 'has enabled'],
          },
          {
            label: 'Benefits',
            description: 'Identify the most significant positive impacts.',
            vocabulary: ['could eliminate', 'dramatically reduces', 'offers the prospect of', 'enables previously impossible'],
          },
          {
            label: 'Ethical Concerns',
            description: 'Examine the ethical, social, or safety questions it raises.',
            vocabulary: ['raises questions about', 'risks of unintended consequences', 'equity of access', 'dual-use potential', 'informed consent'],
          },
          {
            label: 'Future Potential',
            description: 'Consider where the science might lead and what governance is needed.',
            vocabulary: ['the next decade may see', 'regulatory frameworks must', 'international oversight is required', 'responsible development requires'],
          },
        ],
        examples: {
          speaking: {
            context: 'IELTS Speaking Part 3 — The examiner asks about genetic engineering.',
            dialogue: [
              {
                speaker: 'Examiner',
                text: 'Do you think scientists should be allowed to edit the genes of human embryos?',
              },
              {
                speaker: 'Candidate',
                text: "This is one of the most genuinely difficult ethical questions in contemporary science, and I think it requires a distinction between therapeutic and enhancement applications. For therapeutic purposes — correcting single-gene disorders that cause devastating disease — the ethical case is relatively strong if the safety evidence is sufficient and genuinely informed consent from future parents is in place. The mechanism of CRISPR-based editing is now precise enough that therapeutic applications are becoming realistic.",
              },
              {
                speaker: 'Examiner',
                text: 'And for enhancement — making children smarter or taller?',
              },
              {
                speaker: 'Candidate',
                text: "That's where I think the ethical concerns become much more serious. It raises questions about equity of access — enhancement would initially be available only to wealthy families, potentially creating a genetically stratified society — and about the rights of children to an open future, not one predetermined by parental choices. I think international governance frameworks are urgently needed here, because this technology doesn't respect national borders, and the race-to-the-bottom risk — where countries with minimal oversight attract researchers who want to proceed without restrictions — is real.",
              },
            ],
          },
          writing: {
            taskType: 'Task 2 — Discussion',
            prompt:
              'Some people believe that scientific research should be driven by the needs of society. Others argue that scientists should have the freedom to pursue any research they choose, regardless of immediate practical value. Discuss both views and give your own opinion.',
            sample:
              "The tension between directed and curiosity-driven scientific research reflects a deeper question about the relationship between knowledge and utility — one that the history of science consistently complicates. The case for research driven by social need is intuitively compelling: public funding for science is ultimately derived from tax revenues that citizens and governments contribute with the reasonable expectation that the knowledge generated will address human problems. In the context of urgent global challenges — antimicrobial resistance, climate change, pandemic preparedness — directing research resources towards these priorities seems straightforwardly justified. The case for unconstrained scientific freedom is, however, well-supported by historical evidence: many of the most transformative discoveries in human history — from the structure of DNA to the nature of quantum mechanics — were made by researchers following scientific curiosity without any specific application in mind. The constraints of problem-directed funding, critics argue, bias science towards incremental improvements on existing approaches and against the paradigm-breaking discoveries that require a freedom to explore without predetermined destination. In my view, both modes of research are necessary and serve different functions. The most productive research ecosystems — including those in countries with the strongest track records of scientific innovation — combine public investment in directed research on societal priorities with sustained support for fundamental curiosity-driven enquiry, recognising that the latter is not an indulgence but an investment in the discoveries that directed research cannot predict or generate.",
          },
          reading: {
            context: 'Scientific review article — how to follow the structure when reading about a scientific development.',
            passage:
              "CRISPR-Cas9 gene editing technology, developed through research into bacterial immune systems and refined through collaboration between researchers at multiple institutions during the early 2010s, represents one of the most significant biotechnological breakthroughs of the past century — offering, for the first time, a precise, accessible, and relatively low-cost mechanism for modifying specific sequences within the genomes of living organisms [Discovery & Context]. The system operates by using a guide RNA molecule to direct the Cas9 protein to a specific genomic location, where it introduces a targeted cut that the cell's natural repair mechanisms can be guided to complete in ways that either disrupt or replace specific gene sequences [Mechanism]. Current applications include the development of cell therapies for previously untreatable blood cancers, the creation of disease-resistant agricultural crops, and — controversially — the correction of genetic mutations in human embryos in research settings [Current Applications]. The benefits of the technology in its most controlled applications are considerable: single-gene disorders that cause devastating conditions from sickle cell disease to certain forms of blindness are increasingly addressable through therapeutic editing, with clinical trial results demonstrating durable remission in some patient groups [Benefits]. The ethical landscape is correspondingly complex: germline editing — modifications that would be inherited by future generations — raises profound questions about informed consent (from individuals who do not yet exist), equity of access to enhancement applications, and the dual-use potential of genetic technologies that could, in principle, be applied to enhance rather than heal [Ethical Concerns]. International scientific governance frameworks are widely regarded as inadequate to the pace of development, and researchers across the field have called for binding international agreements on germline applications in particular, before regulatory divergence between jurisdictions creates incentives for less-regulated research environments to proceed without oversight [Future Potential].",
          },
          listening: {
            context: 'Science documentary — a researcher explains gene editing to a general audience.',
            script: [
              {
                speaker: 'Presenter',
                text: "CRISPR is often described as a molecular scissors — a tool that lets scientists cut DNA at a precise location and either remove, correct, or replace a specific genetic sequence. That's the basic mechanism. What makes it different from previous gene editing approaches is that it's remarkably precise, relatively inexpensive, and adaptable to a huge range of organisms and cell types.",
              },
              {
                speaker: 'Researcher',
                text: "What we're most excited about in the near term are the therapeutic applications for genetic disease. Sickle cell disease, for instance, is caused by a single mutation. CRISPR gives us a realistic mechanism to correct that mutation in a patient's own stem cells and return them. We're seeing clinical trial data now that suggests durable remission is achievable.",
              },
              {
                speaker: 'Presenter',
                text: 'And the concerns?',
              },
              {
                speaker: 'Researcher',
                text: "The therapeutic applications — treating a patient, with their consent — are ethically manageable. The frontier that requires much more careful governance is germline editing: changes that would be inherited by that person's children, and their children's children. We simply don't know enough about the long-term effects, and the affected individuals — future generations — cannot consent. International oversight frameworks need to move faster than they currently are.",
              },
            ],
          },
        },
      },
      {
        id: 'science-society',
        name: 'Science & Society',
        issue: 'Public trust in science, vaccine hesitancy, science denial, science communication, research funding',
        description:
          'A framework for discussing how science interacts with public understanding and policy. Use when the topic focuses on the relationship between scientific knowledge, public belief, and government action.',
        steps: [
          {
            label: 'Scientific Consensus',
            description: 'Establish what the scientific community has established on a given issue.',
            vocabulary: ['the overwhelming evidence shows', 'peer-reviewed research confirms', 'scientific consensus holds that', 'the IPCC / WHO / CDC states'],
          },
          {
            label: 'Public Understanding',
            description: 'Describe the gap (or alignment) between scientific consensus and public belief.',
            vocabulary: ['public perception lags behind', 'widely misunderstood', 'surveys consistently show', 'significant minority believe'],
          },
          {
            label: 'Sources of Scepticism',
            description: 'Identify why scientific consensus is sometimes rejected by segments of the public.',
            vocabulary: ['distrust of institutions', 'motivated reasoning', 'vested interests spreading doubt', 'media false balance', 'political identity'],
          },
          {
            label: 'Consequences of the Gap',
            description: 'Explain the real-world costs of science scepticism or denial.',
            vocabulary: ['delayed policy response', 'public health costs', 'failure to meet', 'lives that could have been saved'],
          },
          {
            label: 'Improving Science Communication',
            description: 'Discuss how scientists, educators, and institutions can build public trust and understanding.',
            vocabulary: ['transparent communication', 'community trusted messengers', 'addressing concerns respectfully', 'prebunking misinformation', 'long-term relationship building'],
          },
        ],
        examples: {
          speaking: {
            context: 'IELTS Speaking Part 3 — The examiner asks about public trust in science.',
            dialogue: [
              {
                speaker: 'Examiner',
                text: 'Why do you think some people distrust scientific expertise?',
              },
              {
                speaker: 'Candidate',
                text: "Several reasons, and I think it's important to distinguish between them. Some distrust of institutions is rational — scientists have been wrong before, and there are documented cases where research was compromised by vested interests. But a lot of science scepticism is driven by identity politics: for certain communities, rejecting climate science or vaccine safety has become a marker of group membership, and no amount of evidence resolves that if the disagreement is fundamentally social rather than epistemic.",
              },
              {
                speaker: 'Examiner',
                text: 'How should scientists respond?',
              },
              {
                speaker: 'Candidate',
                text: "By engaging differently. The deficit model — assuming that if you just give people more information, they'll change their minds — has a poor track record. What works better is engaging through trusted community messengers rather than abstract institutional authority, addressing the underlying concerns respectfully rather than dismissing them as ignorant, and being transparent about uncertainty. Paradoxically, acknowledging what science doesn't yet know tends to increase rather than decrease trust, because it signals honesty rather than advocacy.",
              },
            ],
          },
          writing: {
            taskType: 'Task 2 — Opinion (Agree/Disagree)',
            prompt:
              'Governments should take action based on scientific evidence, even when this evidence is not fully understood or accepted by the general public. To what extent do you agree or disagree?',
            sample:
              "The relationship between scientific evidence and democratic governance is genuinely complex, but I broadly agree that governments should act on the best available scientific evidence even when public understanding or acceptance lags behind. The alternative — waiting for majority public acceptance before acting on clear scientific evidence — would have produced catastrophic delays in responses to HIV, climate change, and COVID-19, each of which was subject to significant public scepticism even as the scientific consensus was clear and the consequences of inaction were foreseeable. Scientific consensus is not infallible, and humility about uncertainty is appropriate. But the peer review process, replication requirements, and the competitive nature of scientific enquiry provide considerably stronger safeguards against systematic error than public intuition or media-generated false balance. The obligation this places on governments is not simply to act on evidence but to explain the evidence honestly, including its uncertainties, and to invest in science communication that builds rather than assumes public trust. Policies that are scientifically justified but democratically illegitimate — because governments failed to bring the public along — tend to generate backlash that makes future evidence-based governance harder. The goal should therefore be transparent communication that respects public intelligence, engages community trusted messengers, and addresses concerns honestly rather than dismissing them — alongside the willingness to act on evidence before universal public acceptance is achieved, when the consequences of delay are sufficiently serious.",
          },
          reading: {
            context: 'Science policy brief — how to follow the structure when reading about science and society.',
            passage:
              "The scientific consensus on human-caused climate change is, by the measures of evidence weight and researcher agreement, among the most robust in the history of empirical inquiry: peer-reviewed research confirmed by every major national academy of science and synthesised by the IPCC across six comprehensive assessment reports [Scientific Consensus]. Public understanding of this consensus is, however, substantially incomplete: surveys in high-income nations consistently show that significant minorities either doubt the human causation of climate change or underestimate the degree of scientific agreement — a gap that is particularly pronounced in countries where the issue has become politically polarised [Public Understanding]. The sources of this scepticism are multiple: distrust of government and scientific institutions — partly rational, given historical cases where institutional science was compromised — has been amplified by organised campaigns funded by fossil fuel interests to manufacture doubt; media practices of false balance have presented fringe dissenting voices as equivalent to mainstream consensus; and, most durably, climate scepticism has become a marker of political identity in certain communities, making it resistant to evidential correction because the disagreement is fundamentally social rather than epistemic [Sources of Scepticism]. The costs of the resulting policy delay are measurable: each year of inaction locks in additional warming and reduces the range of technically feasible responses, while the communities most exposed to climate impacts — low-income, coastal, and agricultural populations — continue to bear consequences for which they bear minimal responsibility [Consequences of the Gap]. Improving this situation requires science communication strategies that move beyond the information-deficit model: trusted community messengers, transparent acknowledgment of uncertainty, and engagement that addresses the identity and values dimensions of scepticism — not merely its factual dimensions — have each shown greater effectiveness than expert-to-public information transfer [Improving Science Communication].",
          },
          listening: {
            context: 'Science communication workshop — a researcher discusses how to talk about science with sceptical audiences.',
            script: [
              {
                speaker: 'Facilitator',
                text: "You've spent years researching why people reject scientific consensus. What's the most important thing scientists get wrong when they try to communicate?",
              },
              {
                speaker: 'Researcher',
                text: "Assuming that the disagreement is about information. We call it the deficit model — if I just give you the facts, you'll update your beliefs. It sounds reasonable. It doesn't work.",
              },
              {
                speaker: 'Facilitator',
                text: 'Why not?',
              },
              {
                speaker: 'Researcher',
                text: "Because for most of the contested issues — vaccines, climate, evolution — the disagreement isn't really epistemic, it's social. People's beliefs are tied to their identity, their community, their sense of who they trust. When an expert comes in and corrects someone's belief, they're not just challenging a fact — they're challenging a social identity. That triggers defensiveness, not reconsideration.",
              },
              {
                speaker: 'Facilitator',
                text: 'So what works?',
              },
              {
                speaker: 'Researcher',
                text: "Starting from shared values rather than contested facts. Working through trusted messengers from within the community rather than external authority figures. And being genuinely transparent about uncertainty — paradoxically, acknowledging what we don't know increases trust, because it signals that you're being honest rather than pushing an agenda.",
              },
            ],
          },
        },
      },
    ],
  },
  {
    id: 'urban',
    name: 'Urban Development',
    icon: '🏙️',
    description: 'Discuss city planning, urbanisation, infrastructure, and the design of sustainable communities.',
    frameworks: [
      {
        id: 'urban-challenge',
        name: 'Urban Challenge Analysis',
        issue: 'Traffic congestion, housing density, green space, urban poverty, smart cities',
        description:
          'A framework for analysing problems specific to urban environments — from traffic to poverty to infrastructure. Use when the topic focuses on a challenge that arises from or is concentrated in cities.',
        steps: [
          {
            label: 'Urban Context',
            description: "Establish the scale of urbanisation and why cities concentrate both opportunity and challenge.",
            vocabulary: ["more than half the world's population", 'urban population projected to reach', 'cities generate approximately', 'concentration of economic activity'],
          },
          {
            label: 'Problem',
            description: 'Define the specific urban challenge being addressed.',
            vocabulary: ['particularly acute in', 'disproportionately affects urban', 'congestion costs estimated at', 'housing affordability crisis'],
          },
          {
            label: 'Causes',
            description: 'Explain why this problem arises in urban contexts specifically.',
            vocabulary: ['rapid population growth', 'failure of planning frameworks', 'inadequate infrastructure investment', 'land value dynamics'],
          },
          {
            label: 'Effects',
            description: 'Describe the consequences for urban residents, economic productivity, and quality of life.',
            vocabulary: ['reduces productivity', 'worsens health outcomes', 'deepens spatial inequality', 'undermines social cohesion'],
          },
          {
            label: 'Urban Planning Solutions',
            description: 'Outline design, policy, and infrastructure interventions that address the problem.',
            vocabulary: ['mixed-use development', 'transit-oriented development', 'inclusionary zoning', 'green infrastructure', 'participatory planning'],
          },
        ],
        examples: {
          speaking: {
            context: 'IELTS Speaking Part 3 — The examiner asks about living in cities.',
            dialogue: [
              {
                speaker: 'Examiner',
                text: 'What do you think are the biggest problems facing cities today?',
              },
              {
                speaker: 'Candidate',
                text: "Housing affordability is probably the most acute in most major cities — the concentration of economic opportunity in urban centres has driven demand that planning systems haven't kept pace with, and the result is that workers in essential services often can't afford to live near where they work. Traffic congestion is the other significant one, particularly in cities that expanded around car infrastructure rather than public transport.",
              },
              {
                speaker: 'Examiner',
                text: 'What solutions would you suggest?',
              },
              {
                speaker: 'Candidate',
                text: "For housing, transit-oriented development — building higher-density mixed-use development around transport hubs — allows more people to live in well-connected urban locations without requiring car ownership. Inclusionary zoning ensures that new development includes genuinely affordable units rather than contributing exclusively to the premium end. For congestion, the evidence from cities like Singapore and Stockholm strongly supports congestion pricing — charging vehicles for peak-hour access to dense urban areas — combined with investment of those revenues in public transport. The solutions exist; the gap is usually political will.",
              },
            ],
          },
          writing: {
            taskType: 'Task 2 — Problem & Solution',
            prompt:
              'Many cities around the world are facing serious traffic congestion problems. What are the causes of this problem, and what measures can be taken to reduce congestion in urban areas?',
            sample:
              "Urban traffic congestion represents one of the most economically costly and environmentally damaging challenges facing rapidly growing cities, with congestion-related productivity losses estimated in the tens of billions of dollars annually in major metropolitan areas. The causes are structural rather than incidental: most twentieth-century cities in developed nations were planned around private vehicle ownership, resulting in land use patterns — low-density suburbs, separated residential and commercial zones, minimal public transport investment — that make car dependence functionally necessary for large segments of the population. In rapidly urbanising cities in lower-income countries, the combination of rapid population growth, inadequate infrastructure investment, and informal settlement patterns has created different but equally severe congestion dynamics. The effects are significant: beyond the direct economic costs of commuting time, congestion generates air pollution associated with respiratory disease, carbon emissions contributing to climate change, and spatial inequality that concentrates access to economic opportunity among those who can afford central locations or car ownership. Effective interventions require addressing both supply and demand simultaneously. On the supply side, investment in rapid transit infrastructure — particularly metro and bus rapid transit systems — combined with transit-oriented development policies that enable higher-density, mixed-use neighbourhoods around transport nodes, reduces car dependence at the structural level. On the demand side, congestion pricing — implemented with documented success in London, Stockholm, and Singapore — creates direct financial incentives to shift mode or travel time, while revenues earmarked for public transport investment strengthen the alternative. The evidence consistently shows that road-building alone increases rather than reduces congestion by inducing additional demand; the only durable solutions address mode choice and land use simultaneously.",
          },
          reading: {
            context: 'Urban planning report — how to follow the structure when reading about an urban challenge.',
            passage:
              "More than half of the world's population now lives in urban areas, a proportion projected to reach approximately two-thirds by 2050, with the majority of growth concentrated in cities in Asia and sub-Saharan Africa — many of which lack the planning infrastructure and financial capacity to absorb this growth while maintaining liveable conditions [Urban Context]. Housing affordability has emerged as the defining urban challenge across both developed and rapidly urbanising cities: in London, Sydney, and San Francisco, median property prices have reached multiples of median incomes that place ownership beyond the realistic reach of the majority of working-age residents, while in rapidly growing cities in the Global South, inadequate formal housing supply generates informal settlement growth that lacks basic services [Problem]. The causes in developed cities centre on the intersection of restrictive planning frameworks, land value dynamics that make high-cost development most financially viable, and the financialisation of residential property as an investment asset; in rapidly urbanising cities, the primary cause is inadequate infrastructure investment relative to the pace of rural-to-urban migration [Causes]. The consequences span economic and social domains: spatial inequality concentrates economic opportunity in high-cost central areas accessible primarily to high earners; essential workers — teachers, healthcare staff, transport workers — are progressively displaced to peripheral locations, generating long commutes and reducing the labour pool available to urban employers; and residential instability associated with unaffordable rents undermines the community formation and social cohesion on which urban life depends [Effects]. Planning responses include transit-oriented development that enables higher-density housing around public transport nodes, inclusionary zoning that mandates affordable units within new developments, community land trusts that remove residential land from speculative markets, and participatory planning processes that ensure affected communities have meaningful input into neighbourhood change [Urban Planning Solutions].",
          },
          listening: {
            context: 'Urban design podcast — a city planner discusses sustainable city development.',
            script: [
              {
                speaker: 'Host',
                text: "You've spent your career designing cities. What do you think most cities get fundamentally wrong?",
              },
              {
                speaker: 'Planner',
                text: "Building for the car rather than for people. It's a decision made in the mid-twentieth century that most cities are still living with: low-density zoning, separated land uses, road networks that work only if you have a car. Once you've built a city that way, changing it is enormously expensive and politically difficult because the people who own houses in those low-density suburbs have strong interests in keeping them that way.",
              },
              {
                speaker: 'Host',
                text: 'So what can be done?',
              },
              {
                speaker: 'Planner',
                text: "Focus new development on transit corridors — build density where public transport already exists or where you're willing to invest in it. Mixed-use development so that people can walk to services rather than driving to them. And participatory planning so that communities have genuine input rather than having change imposed on them, because the backlash against imposed density is part of what makes this politically so difficult. The cities getting this right — Copenhagen, Vienna, Singapore in different ways — share a long time horizon and consistent political commitment across election cycles.",
              },
            ],
          },
        },
      },
    ],
  },
]
