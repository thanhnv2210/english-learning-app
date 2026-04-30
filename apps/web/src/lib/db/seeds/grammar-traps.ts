/**
 * Seed: grammar_trap_entries
 *
 * Common noun-form errors that IELTS candidates make — wrong singular/plural usage,
 * uncountable nouns treated as countable, false singulars, etc.
 *
 * Run with:
 *   pnpm db:seed:grammar-traps
 *
 * Safe to re-run — uses INSERT … ON CONFLICT DO UPDATE (patches rank only).
 */

import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../schema'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

type SeedEntry = {
  phrase: string
  correction: string
  category: string
  explanation: string
  examples: { wrong: string; correct: string }[]
  rank: number
}

const ENTRIES: SeedEntry[] = [
  // ── Uncountable nouns ──────────────────────────────────────────────────
  {
    phrase: 'informations',
    correction: 'information',
    category: 'uncountable',
    explanation: '"Information" is uncountable in English. It has no plural form. Use "pieces of information" or "some information" instead.',
    examples: [
      { wrong: 'I need some informations about the course.', correct: 'I need some information about the course.' },
      { wrong: 'The report contains many useful informations.', correct: 'The report contains much useful information.' },
      { wrong: 'Please send me the informations by email.', correct: 'Please send me the information by email.' },
    ],
    rank: 5,
  },
  {
    phrase: 'advices',
    correction: 'advice',
    category: 'uncountable',
    explanation: '"Advice" is uncountable. Say "a piece of advice" or "some advice", never "an advice" or "advices".',
    examples: [
      { wrong: 'She gave me some good advices.', correct: 'She gave me some good advice.' },
      { wrong: 'Can I ask you for an advice?', correct: 'Can I ask you for a piece of advice?' },
      { wrong: 'The teacher offered several advices to the students.', correct: 'The teacher offered several pieces of advice to the students.' },
    ],
    rank: 5,
  },
  {
    phrase: 'equipments',
    correction: 'equipment',
    category: 'uncountable',
    explanation: '"Equipment" is uncountable. Use "pieces of equipment" or "some equipment" to refer to multiple items.',
    examples: [
      { wrong: 'The laboratory has modern equipments.', correct: 'The laboratory has modern equipment.' },
      { wrong: 'We need to buy new equipments for the gym.', correct: 'We need to buy new equipment for the gym.' },
      { wrong: 'The factory installed several new equipments last year.', correct: 'The factory installed several new pieces of equipment last year.' },
    ],
    rank: 4,
  },
  {
    phrase: 'researches',
    correction: 'research',
    category: 'uncountable',
    explanation: '"Research" is uncountable as a mass noun. Say "research studies" or "pieces of research", not "researches".',
    examples: [
      { wrong: 'Scientists conducted many researches on this topic.', correct: 'Scientists conducted much research on this topic.' },
      { wrong: 'Her researches show a clear link between diet and health.', correct: 'Her research shows a clear link between diet and health.' },
      { wrong: 'The university published several important researches.', correct: 'The university published several important research papers.' },
    ],
    rank: 4,
  },
  {
    phrase: 'knowledges',
    correction: 'knowledge',
    category: 'uncountable',
    explanation: '"Knowledge" is uncountable. You cannot say "a knowledge" or "knowledges". Use "knowledge of" or "areas of knowledge".',
    examples: [
      { wrong: 'She has a wide knowledges of computer science.', correct: 'She has a wide knowledge of computer science.' },
      { wrong: 'Knowledges gained from experience are invaluable.', correct: 'Knowledge gained from experience is invaluable.' },
      { wrong: 'The course will give you important knowledges.', correct: 'The course will give you important knowledge.' },
    ],
    rank: 4,
  },
  {
    phrase: 'furnitures',
    correction: 'furniture',
    category: 'uncountable',
    explanation: '"Furniture" is uncountable. Use "pieces of furniture" or "some furniture" when referring to multiple items.',
    examples: [
      { wrong: 'They bought new furnitures for the office.', correct: 'They bought new furniture for the office.' },
      { wrong: 'The room had only a few furnitures in it.', correct: 'The room had only a few pieces of furniture in it.' },
      { wrong: 'Modern furnitures are often made from recycled materials.', correct: 'Modern furniture is often made from recycled materials.' },
    ],
    rank: 3,
  },
  {
    phrase: 'luggages',
    correction: 'luggage',
    category: 'uncountable',
    explanation: '"Luggage" (like "baggage") is uncountable. Say "a piece of luggage" or "items of luggage", not "luggages".',
    examples: [
      { wrong: 'Passengers are allowed two luggages on this flight.', correct: 'Passengers are allowed two pieces of luggage on this flight.' },
      { wrong: 'He lost his luggages at the airport.', correct: 'He lost his luggage at the airport.' },
      { wrong: 'She carried three luggages on the train.', correct: 'She carried three bags on the train.' },
    ],
    rank: 3,
  },
  {
    phrase: 'traffics',
    correction: 'traffic',
    category: 'uncountable',
    explanation: '"Traffic" is uncountable. Never say "traffics" — use "traffic jams", "heavy traffic", or "traffic volume" for specifics.',
    examples: [
      { wrong: 'The city suffers from heavy traffics during rush hour.', correct: 'The city suffers from heavy traffic during rush hour.' },
      { wrong: 'Government policies aim to reduce traffics in urban areas.', correct: 'Government policies aim to reduce traffic in urban areas.' },
      { wrong: 'There were a lot of traffics on the highway.', correct: 'There was a lot of traffic on the highway.' },
    ],
    rank: 4,
  },
  // ── Always plural ──────────────────────────────────────────────────────
  {
    phrase: 'a scissor',
    correction: 'scissors / a pair of scissors',
    category: 'always_plural',
    explanation: '"Scissors" is always plural. Use "a pair of scissors" when referring to one item, or just "scissors" with a plural verb.',
    examples: [
      { wrong: 'Can I borrow a scissor?', correct: 'Can I borrow a pair of scissors?' },
      { wrong: 'A scissor is on the desk.', correct: 'The scissors are on the desk.' },
      { wrong: 'She bought a new scissor for the class.', correct: 'She bought a new pair of scissors for the class.' },
    ],
    rank: 3,
  },
  {
    phrase: 'a jean',
    correction: 'jeans / a pair of jeans',
    category: 'always_plural',
    explanation: '"Jeans" is always plural. Say "a pair of jeans" for one garment, and use a plural verb with "jeans".',
    examples: [
      { wrong: 'He wore a blue jean to the interview.', correct: 'He wore a pair of blue jeans to the interview.' },
      { wrong: 'That jean looks very smart on you.', correct: 'Those jeans look very smart on you.' },
      { wrong: 'I need to buy a new jean.', correct: 'I need to buy new jeans.' },
    ],
    rank: 3,
  },
  {
    phrase: 'a trouser',
    correction: 'trousers / a pair of trousers',
    category: 'always_plural',
    explanation: '"Trousers" is always plural. Use "a pair of trousers" for one garment.',
    examples: [
      { wrong: 'He ironed a trouser for the meeting.', correct: 'He ironed a pair of trousers for the meeting.' },
      { wrong: 'A black trouser is required for the uniform.', correct: 'Black trousers are required for the uniform.' },
      { wrong: 'She bought a new trouser at the shop.', correct: 'She bought a new pair of trousers at the shop.' },
    ],
    rank: 3,
  },
  // ── False singular ─────────────────────────────────────────────────────
  {
    phrase: 'a staff',
    correction: 'a member of staff / staff members',
    category: 'false_singular',
    explanation: '"Staff" is a collective noun referring to a group of workers. Say "a staff member" or "a member of staff" for one person — never "a staff".',
    examples: [
      { wrong: 'We hired a new staff last week.', correct: 'We hired a new staff member last week.' },
      { wrong: 'A staff was responsible for the error.', correct: 'A member of staff was responsible for the error.' },
      { wrong: 'The manager spoke to a staff about the issue.', correct: 'The manager spoke to a member of staff about the issue.' },
    ],
    rank: 5,
  },
  {
    phrase: 'a people',
    correction: 'a person / people',
    category: 'false_singular',
    explanation: '"People" is already plural. The singular form is "person". Never say "a people" when referring to one individual.',
    examples: [
      { wrong: 'A people was waiting outside the office.', correct: 'A person was waiting outside the office.' },
      { wrong: 'Only a few peoples attended the event.', correct: 'Only a few people attended the event.' },
      { wrong: 'There was a people asking about the job.', correct: 'There was a person asking about the job.' },
    ],
    rank: 5,
  },
  {
    phrase: 'a police',
    correction: 'a police officer / the police',
    category: 'false_singular',
    explanation: '"Police" is a collective noun and always takes a plural verb. For one officer, say "a police officer" or "a police constable".',
    examples: [
      { wrong: 'A police was standing at the entrance.', correct: 'A police officer was standing at the entrance.' },
      { wrong: 'A police have arrested the suspect.', correct: 'The police have arrested the suspect.' },
      { wrong: 'She called a police for help.', correct: 'She called the police for help.' },
    ],
    rank: 4,
  },
  {
    phrase: 'a news',
    correction: 'a piece of news / the news',
    category: 'false_singular',
    explanation: '"News" is uncountable and always singular. Say "a piece of news" for one item, and use a singular verb: "The news is…"',
    examples: [
      { wrong: 'I heard a good news today.', correct: 'I heard some good news today.' },
      { wrong: 'The news are very surprising.', correct: 'The news is very surprising.' },
      { wrong: 'She shared a news with the team.', correct: 'She shared a piece of news with the team.' },
    ],
    rank: 5,
  },
  // ── Number agreement ───────────────────────────────────────────────────
  {
    phrase: '3 dollar',
    correction: '3 dollars',
    category: 'number_agreement',
    explanation: 'When a number greater than one precedes a noun, the noun must be plural. "3 dollars", "5 kilometres", "10 years".',
    examples: [
      { wrong: 'The ticket costs 3 dollar.', correct: 'The ticket costs 3 dollars.' },
      { wrong: 'She paid 50 dollar for the book.', correct: 'She paid 50 dollars for the book.' },
      { wrong: 'The project took 2 year to complete.', correct: 'The project took 2 years to complete.' },
    ],
    rank: 4,
  },
  {
    phrase: 'one of the reason',
    correction: 'one of the reasons',
    category: 'number_agreement',
    explanation: 'After "one of the", the noun must be plural because you are selecting from multiple items.',
    examples: [
      { wrong: 'One of the main reason for this is poverty.', correct: 'One of the main reasons for this is poverty.' },
      { wrong: 'One of the factor affecting health is diet.', correct: 'One of the factors affecting health is diet.' },
      { wrong: 'One of the challenge we face is inequality.', correct: 'One of the challenges we face is inequality.' },
    ],
    rank: 5,
  },
  {
    phrase: 'many country',
    correction: 'many countries',
    category: 'number_agreement',
    explanation: 'Quantifiers like "many", "several", "few", and "numerous" require a plural noun.',
    examples: [
      { wrong: 'Many country has adopted this policy.', correct: 'Many countries have adopted this policy.' },
      { wrong: 'Several student failed the exam.', correct: 'Several students failed the exam.' },
      { wrong: 'Few company invest enough in staff training.', correct: 'Few companies invest enough in staff training.' },
    ],
    rank: 4,
  },
  // ── Collective nouns ───────────────────────────────────────────────────
  {
    phrase: 'staffs',
    correction: 'staff',
    category: 'collective',
    explanation: '"Staff" as a collective noun does not take an -s plural. The group is simply "staff". For individuals, say "staff members".',
    examples: [
      { wrong: 'The company employs over 200 staffs.', correct: 'The company employs over 200 staff.' },
      { wrong: 'All staffs must attend the meeting.', correct: 'All staff must attend the meeting.' },
      { wrong: 'The new staffs will start on Monday.', correct: 'The new staff members will start on Monday.' },
    ],
    rank: 5,
  },
  {
    phrase: 'curtain',
    correction: 'curtains',
    category: 'number_agreement',
    explanation: 'Window coverings come in pairs, so "curtains" (plural) is the default. Saying "curtain" sounds unnatural unless referring to a single panel specifically.',
    examples: [
      { wrong: 'She drew the curtain to block the sunlight.', correct: 'She drew the curtains to block the sunlight.' },
      { wrong: 'Please open the curtain — it is too dark in here.', correct: 'Please open the curtains — it is too dark in here.' },
      { wrong: 'He bought a new curtain for the bedroom window.', correct: 'He bought new curtains for the bedroom window.' },
    ],
    rank: 3,
  },
  {
    phrase: 'a accommodation',
    correction: 'accommodation',
    category: 'uncountable',
    explanation: '"Accommodation" is uncountable in British English. Never say "an accommodation" or "accommodations" for a place to stay.',
    examples: [
      { wrong: 'I am looking for a accommodation near the university.', correct: 'I am looking for accommodation near the university.' },
      { wrong: 'The company provided accommodations for all employees.', correct: 'The company provided accommodation for all employees.' },
      { wrong: 'Finding a cheap accommodation in the city is difficult.', correct: 'Finding cheap accommodation in the city is difficult.' },
    ],
    rank: 4,
  },
  {
    phrase: 'a work',
    correction: 'work / a job / a piece of work',
    category: 'uncountable',
    explanation: '"Work" as employment or effort is uncountable. Say "a job", "employment", or "a piece of work" depending on the context.',
    examples: [
      { wrong: 'She found a work in the city centre.', correct: 'She found a job in the city centre.' },
      { wrong: 'He submitted a work to his professor.', correct: 'He submitted a piece of work to his professor.' },
      { wrong: 'Getting a work after graduation was difficult.', correct: 'Getting work after graduation was difficult.' },
    ],
    rank: 4,
  },
  {
    phrase: 'homeworks',
    correction: 'homework',
    category: 'uncountable',
    explanation: '"Homework" is uncountable. Say "homework assignments" or "a homework task" for individual items.',
    examples: [
      { wrong: 'The teacher gave us a lot of homeworks.', correct: 'The teacher gave us a lot of homework.' },
      { wrong: 'I have three homeworks to finish tonight.', correct: 'I have three homework assignments to finish tonight.' },
      { wrong: 'Students who do their homeworks regularly perform better.', correct: 'Students who do their homework regularly perform better.' },
    ],
    rank: 4,
  },
  {
    phrase: 'evidences',
    correction: 'evidence',
    category: 'uncountable',
    explanation: '"Evidence" is uncountable. Say "pieces of evidence" or "body of evidence" for multiple instances.',
    examples: [
      { wrong: 'The scientist gathered many evidences to support the theory.', correct: 'The scientist gathered much evidence to support the theory.' },
      { wrong: 'There are strong evidences that diet affects mental health.', correct: 'There is strong evidence that diet affects mental health.' },
      { wrong: 'The court reviewed all the evidences carefully.', correct: 'The court reviewed all the evidence carefully.' },
    ],
    rank: 4,
  },

  // ── More uncountable nouns ─────────────────────────────────────────────
  {
    phrase: 'progresses',
    correction: 'progress',
    category: 'uncountable',
    explanation: '"Progress" is uncountable. You cannot say "progresses" as a noun (though "progresses" exists as a verb). Use "progress" or "advances" instead.',
    examples: [
      { wrong: 'The country has made many progresses in education.', correct: 'The country has made much progress in education.' },
      { wrong: 'We can see clear progresses in the student\'s writing.', correct: 'We can see clear progress in the student\'s writing.' },
      { wrong: 'The report highlights the progresses achieved so far.', correct: 'The report highlights the progress achieved so far.' },
    ],
    rank: 5,
  },
  {
    phrase: 'weathers',
    correction: 'weather',
    category: 'uncountable',
    explanation: '"Weather" is uncountable. It has no plural form. Use "weather conditions" or "types of weather" for variety.',
    examples: [
      { wrong: 'The weathers in this region are unpredictable.', correct: 'The weather in this region is unpredictable.' },
      { wrong: 'We experienced different weathers during our trip.', correct: 'We experienced different types of weather during our trip.' },
      { wrong: 'Extreme weathers are becoming more common due to climate change.', correct: 'Extreme weather is becoming more common due to climate change.' },
    ],
    rank: 4,
  },
  {
    phrase: 'educations',
    correction: 'education',
    category: 'uncountable',
    explanation: '"Education" as a system or concept is uncountable. Say "fields of education" or "levels of education" for specific references.',
    examples: [
      { wrong: 'Governments must invest more in educations.', correct: 'Governments must invest more in education.' },
      { wrong: 'She received good educations at a private school.', correct: 'She received a good education at a private school.' },
      { wrong: 'Access to quality educations remains unequal worldwide.', correct: 'Access to quality education remains unequal worldwide.' },
    ],
    rank: 4,
  },
  {
    phrase: 'pollutions',
    correction: 'pollution',
    category: 'uncountable',
    explanation: '"Pollution" as a mass noun is uncountable. Use "types of pollution" (air pollution, water pollution) for different forms.',
    examples: [
      { wrong: 'Factories produce many pollutions every day.', correct: 'Factories produce a lot of pollution every day.' },
      { wrong: 'The city faces serious pollutions from traffic and industry.', correct: 'The city faces serious pollution from traffic and industry.' },
      { wrong: 'Environmental pollutions are damaging ecosystems.', correct: 'Environmental pollution is damaging ecosystems.' },
    ],
    rank: 4,
  },
  {
    phrase: 'a fun',
    correction: 'fun',
    category: 'uncountable',
    explanation: '"Fun" as a noun is uncountable. Never say "a fun" or "funs". Say "great fun", "lots of fun", or use it as an adjective: "a fun activity".',
    examples: [
      { wrong: 'The party was a great fun.', correct: 'The party was great fun.' },
      { wrong: 'We had a lot of funs at the beach.', correct: 'We had a lot of fun at the beach.' },
      { wrong: 'Learning English can be a fun if done correctly.', correct: 'Learning English can be fun if done correctly.' },
    ],
    rank: 3,
  },
  {
    phrase: 'feedbacks',
    correction: 'feedback',
    category: 'uncountable',
    explanation: '"Feedback" is uncountable. Say "pieces of feedback" or "some feedback", never "feedbacks" or "a feedback".',
    examples: [
      { wrong: 'The manager gave us several feedbacks after the presentation.', correct: 'The manager gave us some feedback after the presentation.' },
      { wrong: 'I received positive feedbacks from my clients.', correct: 'I received positive feedback from my clients.' },
      { wrong: 'Can you give me a feedback on my essay?', correct: 'Can you give me some feedback on my essay?' },
    ],
    rank: 5,
  },
  {
    phrase: 'softwares',
    correction: 'software',
    category: 'uncountable',
    explanation: '"Software" is uncountable in standard usage. Say "software applications", "software programs", or "pieces of software" for multiple items.',
    examples: [
      { wrong: 'We need to update all our softwares.', correct: 'We need to update all our software.' },
      { wrong: 'The company develops various softwares for businesses.', correct: 'The company develops various software applications for businesses.' },
      { wrong: 'He installed three new softwares on his laptop.', correct: 'He installed three new software programs on his laptop.' },
    ],
    rank: 4,
  },
  {
    phrase: 'a permission',
    correction: 'permission',
    category: 'uncountable',
    explanation: '"Permission" (meaning authorisation) is uncountable. Say "ask for permission" or "grant permission", not "a permission". The plural "permissions" only applies in computing.',
    examples: [
      { wrong: 'You need a permission to enter the building.', correct: 'You need permission to enter the building.' },
      { wrong: 'She asked for a permission to leave early.', correct: 'She asked for permission to leave early.' },
      { wrong: 'The government gave a permission for the construction.', correct: 'The government gave permission for the construction.' },
    ],
    rank: 4,
  },
  {
    phrase: 'violences',
    correction: 'violence',
    category: 'uncountable',
    explanation: '"Violence" is uncountable. Use "acts of violence" or "incidents of violence" when referring to specific events.',
    examples: [
      { wrong: 'The media frequently reports on violences in the city.', correct: 'The media frequently reports on violence in the city.' },
      { wrong: 'Domestic violences affect millions of families worldwide.', correct: 'Domestic violence affects millions of families worldwide.' },
      { wrong: 'The government introduced laws to reduce violences.', correct: 'The government introduced laws to reduce violence.' },
    ],
    rank: 4,
  },
  {
    phrase: 'a behaviour',
    correction: 'behaviour',
    category: 'uncountable',
    explanation: '"Behaviour" (general conduct) is uncountable. Say "good behaviour", "examples of behaviour". The plural "behaviours" is only used in academic/scientific contexts for distinct behaviour patterns.',
    examples: [
      { wrong: 'The child showed a bad behaviour in class.', correct: 'The child showed bad behaviour in class.' },
      { wrong: 'A rude behaviour is not acceptable in the workplace.', correct: 'Rude behaviour is not acceptable in the workplace.' },
      { wrong: 'His a strange behaviour worried the teacher.', correct: 'His strange behaviour worried the teacher.' },
    ],
    rank: 3,
  },
  {
    phrase: 'moneys',
    correction: 'money',
    category: 'uncountable',
    explanation: '"Money" is uncountable in everyday use. Say "a sum of money", "funds", or "large amounts of money" — not "moneys".',
    examples: [
      { wrong: 'She saved a lot of moneys for her studies.', correct: 'She saved a lot of money for her studies.' },
      { wrong: 'Governments spend moneys on infrastructure every year.', correct: 'Governments spend money on infrastructure every year.' },
      { wrong: 'He donated moneys to several charities.', correct: 'He donated money to several charities.' },
    ],
    rank: 4,
  },

  // ── More always plural ─────────────────────────────────────────────────
  {
    phrase: 'a glass (spectacles)',
    correction: 'glasses / a pair of glasses',
    category: 'always_plural',
    explanation: '"Glasses" (spectacles) is always plural. Use "a pair of glasses" for one item.',
    examples: [
      { wrong: 'She wears a glass to read.', correct: 'She wears glasses to read.' },
      { wrong: 'He lost his glass at the library.', correct: 'He lost his glasses at the library.' },
      { wrong: 'I need a new glass — my prescription has changed.', correct: 'I need a new pair of glasses — my prescription has changed.' },
    ],
    rank: 3,
  },
  {
    phrase: 'a headphone',
    correction: 'headphones / a pair of headphones',
    category: 'always_plural',
    explanation: '"Headphones" is always plural. Use "a pair of headphones" for one set.',
    examples: [
      { wrong: 'She bought a new headphone for the office.', correct: 'She bought a new pair of headphones for the office.' },
      { wrong: 'His headphone is very expensive.', correct: 'His headphones are very expensive.' },
      { wrong: 'Can I borrow a headphone?', correct: 'Can I borrow a pair of headphones?' },
    ],
    rank: 3,
  },
  {
    phrase: 'a clothe',
    correction: 'clothes',
    category: 'always_plural',
    explanation: '"Clothes" has no singular form in modern English. Say "a piece of clothing", "a garment", or "an item of clothing" for one piece.',
    examples: [
      { wrong: 'She packed a clothe for the trip.', correct: 'She packed a piece of clothing for the trip.' },
      { wrong: 'A clothe is hanging on the door.', correct: 'A piece of clothing is hanging on the door.' },
      { wrong: 'He bought an expensive clothe at the mall.', correct: 'He bought an expensive item of clothing at the mall.' },
    ],
    rank: 3,
  },

  // ── More false singular ────────────────────────────────────────────────
  {
    phrase: 'criterias',
    correction: 'criteria',
    category: 'false_singular',
    explanation: '"Criteria" is already the plural of "criterion". Never add an -s to it. Use "criterion" for the singular and "criteria" for plural.',
    examples: [
      { wrong: 'The selection criterias are clearly defined.', correct: 'The selection criteria are clearly defined.' },
      { wrong: 'There are several criterias for admission.', correct: 'There are several criteria for admission.' },
      { wrong: 'This criterias does not apply to all applicants.', correct: 'This criterion does not apply to all applicants.' },
    ],
    rank: 5,
  },
  {
    phrase: 'phenomenons',
    correction: 'phenomena',
    category: 'false_singular',
    explanation: '"Phenomena" is the plural of "phenomenon". Do not add -s. Use "phenomenon" (singular) and "phenomena" (plural).',
    examples: [
      { wrong: 'Climate change is one of the most alarming phenomenons of our time.', correct: 'Climate change is one of the most alarming phenomena of our time.' },
      { wrong: 'Scientists are studying several weather phenomenons.', correct: 'Scientists are studying several weather phenomena.' },
      { wrong: 'This phenomenons has been observed globally.', correct: 'This phenomenon has been observed globally.' },
    ],
    rank: 4,
  },
  {
    phrase: 'medias',
    correction: 'media',
    category: 'false_singular',
    explanation: '"Media" is already the plural of "medium". Do not add -s. It takes a plural verb: "The media are…" (though singular use is now widely accepted).',
    examples: [
      { wrong: 'Social medias have changed the way people communicate.', correct: 'Social media has changed the way people communicate.' },
      { wrong: 'The medias reported the story differently.', correct: 'The media reported the story differently.' },
      { wrong: 'Various medias were used to spread the message.', correct: 'Various media were used to spread the message.' },
    ],
    rank: 4,
  },
  {
    phrase: 'a cattle',
    correction: 'cattle / a head of cattle',
    category: 'false_singular',
    explanation: '"Cattle" is always plural and has no singular form. Say "a head of cattle", "a cow", or "an ox" for one animal.',
    examples: [
      { wrong: 'A cattle was grazing in the field.', correct: 'A cow was grazing in the field.' },
      { wrong: 'The farmer owns a cattle.', correct: 'The farmer owns a head of cattle.' },
      { wrong: 'A cattle is used for dairy production.', correct: 'Cattle are used for dairy production.' },
    ],
    rank: 3,
  },

  // ── More number agreement ──────────────────────────────────────────────
  {
    phrase: 'a 5-years experience',
    correction: 'a 5-year experience / 5 years of experience',
    category: 'number_agreement',
    explanation: 'When a number + noun acts as a compound adjective before another noun, the noun stays singular. "A 5-year plan", "a 10-kilometre race", "a 3-hour meeting".',
    examples: [
      { wrong: 'She has a 10-years experience in software engineering.', correct: 'She has 10 years of experience in software engineering.' },
      { wrong: 'It was a 2-hours journey by train.', correct: 'It was a 2-hour journey by train.' },
      { wrong: 'The company launched a 5-years plan to expand globally.', correct: 'The company launched a 5-year plan to expand globally.' },
    ],
    rank: 5,
  },
  {
    phrase: 'less people',
    correction: 'fewer people',
    category: 'number_agreement',
    explanation: 'Use "fewer" with countable nouns (people, cars, jobs) and "less" with uncountable nouns (money, time, water). This is a very common IELTS mistake.',
    examples: [
      { wrong: 'Less people are choosing to live in rural areas.', correct: 'Fewer people are choosing to live in rural areas.' },
      { wrong: 'There are less cars on the road on weekends.', correct: 'There are fewer cars on the road on weekends.' },
      { wrong: 'The policy created less jobs than expected.', correct: 'The policy created fewer jobs than expected.' },
    ],
    rank: 5,
  },
  {
    phrase: 'the number of student',
    correction: 'the number of students',
    category: 'number_agreement',
    explanation: 'After "the number of", the noun must always be plural. Also note: "the number of" takes a singular verb, while "a number of" takes a plural verb.',
    examples: [
      { wrong: 'The number of student applying has increased.', correct: 'The number of students applying has increased.' },
      { wrong: 'The number of unemployed worker is rising.', correct: 'The number of unemployed workers is rising.' },
      { wrong: 'A number of country has signed the agreement.', correct: 'A number of countries have signed the agreement.' },
    ],
    rank: 5,
  },

  // ── More collective nouns ──────────────────────────────────────────────
  {
    phrase: 'governments',
    correction: 'the government',
    category: 'collective',
    explanation: 'When referring to a single country\'s ruling body, say "the government" (singular). "Governments" is only correct when comparing multiple countries\' governments.',
    examples: [
      { wrong: 'Governments has announced new tax reforms this week.', correct: 'The government has announced new tax reforms this week.' },
      { wrong: 'The governments of this country should do more for the poor.', correct: 'The government of this country should do more for the poor.' },
      { wrong: 'Governments need to take responsibility for this problem.', correct: 'The government needs to take responsibility for this problem.' },
    ],
    rank: 4,
  },
  {
    phrase: 'audiences',
    correction: 'the audience',
    category: 'collective',
    explanation: '"Audience" refers to all viewers/listeners of a single event as one group. Use "the audience" for one gathering. "Audiences" is only for multiple separate gatherings.',
    examples: [
      { wrong: 'The audiences were impressed by the performance.', correct: 'The audience was impressed by the performance.' },
      { wrong: 'Audiences of the show gave it a standing ovation.', correct: 'The audience of the show gave it a standing ovation.' },
      { wrong: 'The speaker engaged the audiences throughout the talk.', correct: 'The speaker engaged the audience throughout the talk.' },
    ],
    rank: 3,
  },
  {
    phrase: 'a group of student',
    correction: 'a group of students',
    category: 'number_agreement',
    explanation: 'After "a group of", the noun must be plural. The same applies to "a team of", "a number of", "a pair of".',
    examples: [
      { wrong: 'A group of student visited the museum yesterday.', correct: 'A group of students visited the museum yesterday.' },
      { wrong: 'A team of engineer designed the bridge.', correct: 'A team of engineers designed the bridge.' },
      { wrong: 'A number of worker went on strike last week.', correct: 'A number of workers went on strike last week.' },
    ],
    rank: 5,
  },
]

async function seed() {
  console.log(`Seeding ${ENTRIES.length} grammar trap entries…`)
  let inserted = 0

  for (const item of ENTRIES) {
    const result = await db
      .insert(schema.grammarTrapEntries)
      .values({ ...item, phrase: item.phrase.toLowerCase() })
      .onConflictDoUpdate({
        target: schema.grammarTrapEntries.phrase,
        set: { rank: item.rank },
      })
      .returning({ id: schema.grammarTrapEntries.id, phrase: schema.grammarTrapEntries.phrase })

    if (result.length > 0) inserted++
  }

  console.log(`Done — ${inserted} upserted.`)
  await client.end()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
