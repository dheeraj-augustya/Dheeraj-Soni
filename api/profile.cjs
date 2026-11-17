// Curated answers used when the generative provider is not configured or reachable.
const facts = [
  [/academic|medicine|e-commerce|ecommerce|शैक्षणिक|अकादमिक|दवा/i,
    'His academic projects include an Online Medicine Selling Web Application using Django, HTML, CSS and JavaScript, where he built the frontend module (October 2023–January 2024), and a responsive E-commerce Website using HTML, CSS and JavaScript.',
    'उनके शैक्षणिक प्रोजेक्ट में Django, HTML, CSS और JavaScript का Online Medicine Selling Web Application शामिल है, जिसमें उन्होंने फ्रंटएंड मॉड्यूल बनाया (अक्टूबर 2023–जनवरी 2024). उन्होंने HTML, CSS और JavaScript से एक रिस्पॉन्सिव E-commerce Website भी बनाई.'],
  [/educat|degree|college|university|शिक्षा|पढ़ाई|डिग्री|padhai|qualification/i,
    'Dheeraj completed a B.Tech (Lateral Entry) in Computer Science at AKTU, Lucknow (September 2022–July 2025), and a Bachelor of Science at Awadhesh Pratap Singh University, Rewa (August 2019–July 2022).',
    'धीरज ने AKTU, लखनऊ से कंप्यूटर साइंस में B.Tech (लेटरल एंट्री, सितंबर 2022–जुलाई 2025) और अवधेश प्रताप सिंह विश्वविद्यालय, रीवा से B.Sc. (अगस्त 2019–जुलाई 2022) किया है.'],
  [/skill|technolog|stack|कौशल|तकनीक|स्किल|aata|आता/i,
    'Dheeraj works with C#, ASP.NET Core Web API, Entity Framework Core, SQL Server, JWT and Redis. His frontend skills include Angular, Next.js, React and TypeScript. He also builds WordPress websites and has experience with Java, MERN and Django.',
    'धीरज C#, ASP.NET Core Web API, Entity Framework Core, SQL Server, JWT और Redis पर काम करते हैं. फ्रंटएंड में Angular, Next.js, React और TypeScript उनके प्रमुख कौशल हैं. उन्हें WordPress, Java, MERN और Django का भी अनुभव है.'],
  [/experience|company|career|work history|अनुभव|कंपनी|नौकरी|काम करते/i,
    'Dheeraj is a Full Stack Developer at Glidedmatrix Technologies (June 2026–present). Previously, he worked at BTJ Alpha Technology (3 November 2025–11 June 2026) and trained students in full-stack Java, web development and MERN at Questech (25 June–3 November 2025).',
    'धीरज जून 2026 से Glidedmatrix Technologies में Full Stack Developer हैं. इससे पहले वे BTJ Alpha Technology में 3 नवंबर 2025 से 11 जून 2026 तक काम कर चुके हैं. उन्होंने Questech में 25 जून से 3 नवंबर 2025 तक Full Stack Java, वेब डेवलपमेंट और MERN की ट्रेनिंग दी.'],
  [/project|arivacasa|solarcrm|missal|temple|inventory|veer|workzen|wordpress|प्रोजेक्ट|परियोजना/i,
    'His projects include ArivaCasa (home-services marketplace), SolarCRM and MissalRecord (Government of Chhattisgarh), using .NET Web API, Next.js and Angular. At BTJ, he built temple and hardware inventory systems, Veer Associates loan processing and Workzen Manpower Management. His WordPress work includes tripzeniaholiday.in, workzenmanpower.com, vijaybhardwajproduction.com and gtrindia.com.',
    'उनके प्रोजेक्ट में ArivaCasa (होम-सर्विस मार्केटप्लेस), SolarCRM और छत्तीसगढ़ सरकार का MissalRecord शामिल हैं; इनमें .NET Web API, Next.js और Angular का उपयोग हुआ है. BTJ में उन्होंने मंदिर और हार्डवेयर इन्वेंटरी सिस्टम, Veer Associates और Workzen Manpower Management बनाए. उनके WordPress कार्यों में tripzeniaholiday.in, workzenmanpower.com, vijaybhardwajproduction.com और gtrindia.com शामिल हैं.'],
  [/contact|hire|email|phone|salary|rate|available|संपर्क|ईमेल|हायर|सैलरी|कीमत|sampark/i,
    'His portfolio welcomes full-stack roles, product engineering and custom web collaborations. Contact Dheeraj at dheerajsoni.dev@gmail.com or +91 6394252736 to discuss a role or project and confirm rates and scheduling directly.',
    'उनका पोर्टफोलियो Full Stack भूमिकाओं, प्रोडक्ट इंजीनियरिंग और कस्टम वेब प्रोजेक्ट के लिए आमंत्रित करता है. धीरज से dheerajsoni.dev@gmail.com या +91 6394252736 पर संपर्क करें और फीस व समय की सीधे पुष्टि करें.'],
  [/location|where.*(live|based|from)|कहाँ|कहां|शहर|kahan/i,
    'Dheeraj is based in Prayagraj, Uttar Pradesh, India. He speaks Hindi and English.',
    'धीरज प्रयागराज, उत्तर प्रदेश, भारत में रहते हैं. वे हिंदी और अंग्रेज़ी बोलते हैं.'],
  [/certif|award|पुरस्कार|सर्टिफिकेट|प्रमाणपत्र/i,
    'His certifications cover Web Development (Infovirtech), Java (KTCS India), Django and Data Structures and Algorithms. He received the “Excellence through Innovation” award for contributions to a Cyber Security Awareness Program with AKTU and UP Police.',
    'उनके प्रमाणपत्र Web Development (Infovirtech), Java (KTCS India), Django और Data Structures and Algorithms में हैं. AKTU और UP Police के साइबर सुरक्षा जागरूकता कार्यक्रम में योगदान के लिए उन्हें “Excellence through Innovation” पुरस्कार मिला.'],
  [/hello|\bhi\b|namaste|नमस्ते|who|about|introduc|कौन|परिचय|बारे/i,
    'Dheeraj Soni is a Full Stack Developer based in Prayagraj. He builds backend APIs with .NET, frontends with Next.js and Angular, and WordPress websites. Ask me about his skills, projects, education or experience.',
    'धीरज सोनी प्रयागराज के Full Stack Developer हैं. वे .NET से बैकएंड API, Next.js और Angular से फ्रंटएंड और WordPress वेबसाइट बनाते हैं. आप उनके कौशल, प्रोजेक्ट, शिक्षा या अनुभव के बारे में पूछ सकते हैं.'],
];

module.exports = function profileAnswer(messages, language) {
  const question = messages.at(-1).text;
  const hindi = !/\b(in english|reply in english|answer in english)\b/i.test(question) && (/\b(in hindi|reply in hindi|answer in hindi)\b/i.test(question) || /[\u0900-\u097f]/u.test(question) || language === 'hi-IN' || /\b(aap|aapka|kya|kaise|hai|hain|batao|bataiye)\b/i.test(question));
  const matches = facts.filter(([pattern]) => pattern.test(question));
  const selected = matches.slice(0, 2);
  return selected.length ? selected.map((fact) => fact[hindi ? 2 : 1]).join('\n\n')
    : hindi ? 'मेरे पास इस सवाल का सत्यापित उत्तर पोर्टफोलियो में नहीं है. आप धीरज के कौशल, प्रोजेक्ट, अनुभव, शिक्षा या संपर्क के बारे में पूछ सकते हैं. अधिक जानकारी के लिए dheerajsoni.dev@gmail.com पर संपर्क करें.'
      : 'I do not have a verified portfolio answer to that question. Ask about Dheeraj’s skills, projects, experience, education or contact details, or email dheerajsoni.dev@gmail.com for more information.';
};
