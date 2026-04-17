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
]
