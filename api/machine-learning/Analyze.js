const Sentiment = require("sentiment");
const nlp = require("compromise");

const sentimentAnalyzer = new Sentiment();

const stopwords = new Set([
  "saya", "aku", "kamu", "loe", "lu", "dia", "mereka", "kami", "kita", "anda",
  "yang", "dan", "atau", "dengan", "untuk", "karena", "sebab", "tetapi", "tapi",
  "lalu", "kemudian", "jadi", "agar", "sehingga", "jika", "kalau", "hingga", "ke", "dari", "pada",
  "adalah", "ada", "itu", "ini", "tersebut", "dapat", "bisa", "harus", "akan", "telah", "sudah",
  "belum", "masih", "sedang", "lagi", "lebih", "kurang", "saja", "juga", "hanya", "cuma",
  "nah", "ya", "yah", "kok", "loh", "lah", "dong", "deh", "woy", "anj", "anjay", "bjir", "ajg",
  "si", "kayak", "gitu", "begitu", "apa", "kenapa", "nggak", "ga", "ngga", "enggak",
  "bang", "gan", "min", "bro", "sis", "om", "mbak", "mas", "hmm", "hehe", "wkwk", "lol", "haha",
  "eh", "mah", "kan", "nya", "nyaa", "nyaan", "pun", "toh", "dong", "yaudah", "yowes"
]);

const miniKamus = [
  "kode", "script", "program", "coding", "debug", "compile", "run", "execute",
  "syntax", "function", "variable", "loop", "array", "object", "class", "method",
  "parameter", "return", "error", "logic", "null", "undefined", "boolean", "string", "integer",
  "javascript", "typescript", "python", "java", "golang", "php", "csharp", "rust", "ruby", "dart", "bash",
  "terminal", "shell", "zsh", "cli", "command", "prompt", "path", "sudo", "install",
  "package", "paket", "manager", "npm", "yarn", "pnpm", "pip", "apt", "brew",
  "react", "vue", "svelte", "next", "nuxt", "express", "flask", "django", "node", "vite", "tailwind",
  "linux", "windows", "mac", "os", "ubuntu", "arch", "debian", "system", "kernel",
  "frontend", "backend", "fullstack", "api", "rest", "graphql", "server", "client", "database", "mongo",
  "mysql", "postgres", "sqlite", "http", "https", "json", "xml", "auth", "token", "jwt",
  "git", "github", "gitlab", "branch", "commit", "merge", "push", "pull", "remote", "repo",
  "ui", "ux", "design", "layout", "responsive", "element", "component", "style", "css", "html",
  "chat", "bot", "pesan", "user", "admin", "group", "command", "text", "message"
];

const emotionLexicon = {
  senang: ["senang", "bahagia", "gembira", "hepi", "asik"],
  marah: ["marah", "kesal", "emosi", "geram"],
  takut: ["takut", "cemas", "khawatir", "grogi"],
  sedih: ["sedih", "kecewa", "galau", "murung"]
};

const intentLexicon = {
  minta_tolong: ["tolong", "bantu", "bisa bantu", "mohon"],
  tanya_info: ["apa", "bagaimana", "kenapa", "dimana", "siapa", "kapan", "mengapa", "berapa", "dapatkah"],
  keluhan: ["jelek", "buruk", "error", "gagal", "salah", "tidak bisa", "gabisa"],
  salam: ["halo", "hi", "hai", "selamat pagi", "selamat siang", "selamat malam"]
};

const badWords = ["ancuk", "ancok", "ajig", "anjay", "anjing", "anying", "anjir", "asu", "asyu", "babangus", "babi", "bacol", "bacot", 
  "bagong", "bajingan", "balegug", "banci", "bangke", "bangsat", "bedebah", "bedegong", "bego", "belegug", "beloon", 
  "bencong", "bloon", "blo'on", "bodoh", "boloho", "buduk", "budug", "celeng", "cibai", "cibay", "cocot", "cocote", 
  "cok", "cokil", "colai", "colay", "coli", "colmek", "conge", "congean", "congek", "congor", "cuk", "cukima", "cukimai", 
  "cukimay", "dancok", "entot", "entotan", "ewe", "ewean", "gelo", "genjik", "germo", "gigolo", "goblo", "goblog", 
  "goblok", "hencet", "henceut", "heunceut", "homo", "idiot", "itil", "jancuk", "jancok", "jablay", "jalang", "jembut", 
  "jiancok", "jilmek", "jurig", "kacung", "kampang", "kampret", "kampungan", "kehed", "kenthu", "kentot", "kentu", 
  "keparat", "kimak", "kintil", "kirik", "kunyuk", "kurap", "konti", "kontol", "kopet", "koplok", "lacur", "lebok", 
  "lonte", "maho", "meki", "memek", "monyet", "ndas", "ndasmu", "ngehe", "ngentot", "nggateli", "nyepong", "ngewe", 
  "ngocok", "pante", "pantek",  "patek", "pathek", "peju", "pejuh", "pecun", "pecundang", "pelacur", "pelakor", "peler", 
  "pepek", "puki", "pukima", "pukimae", "pukimak", "pukimay", "sampah", "sepong", "sial", "sialan", "silit", "sinting", 
  "sontoloyo", "tai", "taik", "tempek", "tempik", "tete", "tetek", "tiembokne", "titit", "toket", "tolol", "ublag", 
  "udik", "wingkeng"];

const spamKeywords = [
  "transfer sekarang", "klik link", "hadiah gratis", "menangkan", "pinjaman cepat",
  "tanpa jaminan", "promo terbatas", "diskon besar", "kerja online", "uang mudah",
  "penghasilan tambahan", "investasi terpercaya", "langsung cair", "deposit sekarang",
  "akun premium gratis", "bonus saldo", "beli followers", "beli subscriber",
  "klik di sini", "whatsapp saya", "hubungi admin"
];

const scamKeywords = [
  "penipuan", "scam", "bohong", "tipu", "phishing", "modus", "akun palsu",
  "kirim uang", "transfer ke", "kode otp", "verifikasi ulang", "reset akun"
];

const productMap = {
  "javascript": ["VS Code", "ESLint", "Prettier", "React.js", "Node.js"],
  "typescript": ["TypeScript", "ts-node", "tsconfig", "Next.js"],
  "python": ["Python 3", "Jupyter Notebook", "Anaconda", "Flask", "Django"],
  "java": ["IntelliJ IDEA", "Spring Boot", "Eclipse"],
  "golang": ["GoLang", "GoLand", "Gin", "Echo"],
  "php": ["PHP 8", "Laravel", "Composer"],
  "csharp": ["Visual Studio", ".NET 6", "Blazor"],
  "ruby": ["Ruby", "Rails", "RVM"],
  "rust": ["Rust", "Cargo", "Rocket", "Tokio"],
  "dart": ["Dart", "Flutter", "Android Studio"],
  "react": ["React.js", "Create React App", "Next.js"],
  "vue": ["Vue.js", "Nuxt.js", "Vite"],
  "svelte": ["Svelte", "SvelteKit"],
  "tailwind": ["Tailwind CSS", "DaisyUI"],
  "html": ["HTML5", "MDN HTML Reference"],
  "css": ["CSS3", "Sass", "PostCSS"],
  "node": ["Node.js", "Express.js", "NestJS"],
  "express": ["Express.js", "Postman"],
  "django": ["Django", "Django REST Framework"],
  "flask": ["Flask", "Flask-RESTful"],
  "api": ["Postman", "Swagger UI", "Insomnia"],
  "mysql": ["MySQL", "phpMyAdmin", "MySQL Workbench"],
  "postgres": ["PostgreSQL", "pgAdmin"],
  "sqlite": ["SQLite", "DB Browser for SQLite"],
  "mongo": ["MongoDB", "Compass", "Mongoose"],
  "redis": ["Redis", "RedisInsight"],
  "database": ["PostgreSQL", "MongoDB", "MySQL"],
  "docker": ["Docker", "Docker Compose", "Portainer"],
  "kubernetes": ["Kubernetes", "Minikube", "Lens"],
  "ci": ["GitHub Actions", "CircleCI", "Travis CI"],
  "deployment": ["Netlify", "Vercel", "Render", "Heroku"],
  "cloud": ["AWS", "Google Cloud", "Azure", "DigitalOcean"],
  "auth": ["Auth0", "Firebase Auth", "JWT.io"],
  "jwt": ["JWT.io", "jsonwebtoken (npm)"],
  "git": ["Git", "GitHub", "GitLab", "Bitbucket", "GitKraken"],
  "branch": ["GitHub Desktop", "SourceTree"],
  "bash": ["Oh My Bash", "bash-it"],
  "zsh": ["Oh My Zsh", "Powerlevel10k", "Prezto"],
  "terminal": ["iTerm2", "Hyper", "Alacritty", "Termux"],
  "cli": ["Fig", "Starship", "fzf", "tldr"],
  "editor": ["VS Code", "Sublime Text", "NeoVim", "JetBrains IDE"],
  "vscode": ["VS Code", "Live Share", "Code Runner"],
  "intellij": ["IntelliJ IDEA", "JetBrains Toolbox"],
  "visual": ["Visual Studio", "Live Share"],
  "linux": ["Ubuntu", "Arch Linux", "Fedora", "Pop!_OS"],
  "ubuntu": ["Ubuntu", "Ubuntu Server", "Ubuntu Studio"],
  "arch": ["Arch Linux", "Manjaro"],
  "windows": ["Windows 11", "WSL2", "PowerToys"],
  "mac": ["macOS Ventura", "Homebrew", "iTerm2"],
  "json": ["JSONLint", "JSON Formatter", "Postman"],
  "debug": ["Chrome DevTools", "VS Code Debugger"],
  "design": ["Figma", "Adobe XD", "Canva"],
  "api testing": ["Postman", "Insomnia", "Hoppscotch"],
  "project": ["Trello", "Jira", "Notion"],
  "documentation": ["Docusaurus", "ReadTheDocs", "Swagger UI"]
};


function normalizeWord(word) {
  return word.toLowerCase().replace(/[^a-z0-9]/gi, '').trim();
}

function segmentWord(word) {
  const result = [];
  let current = "";
  let i = 0;
  while (i < word.length) {
    current += word[i];
    if (miniKamus.includes(current)) {
      result.push(current);
      current = "";
    }
    i++;
  }
  if (current) result.push(current);
  const totalLength = result.join("").length;
  const isValidSplit = result.length > 1 && totalLength === word.length && result.every(k => k.length > 2);
  return isValidSplit ? result.join(" ") : word;
}

function detectEmotion(text) {
  const tokens = text.toLowerCase().split(/\s+/);
  for (const [emotion, keywords] of Object.entries(emotionLexicon)) {
    if (tokens.some(token => keywords.includes(token))) return emotion;
  }
  return "netral";
}

function detectIntent(text) {
  const lower = text.toLowerCase();
  for (const [intent, patterns] of Object.entries(intentLexicon)) {
    if (patterns.some(p => lower.includes(p))) return intent;
  }
  return "komentar";
}

function detectSpamScam(text) {
  const lower = text.toLowerCase();
  const spam = spamKeywords.some(k => lower.includes(k));
  const scam = scamKeywords.some(k => lower.includes(k));
  if (spam && scam) return "scam+spam";
  if (spam) return "spam";
  if (scam) return "scam";
  return "none";
}

function analyzeMessages(messages) {
  const productMentionCount = {};
  const techMentionCount = {};
  const nounMap = {};
  const questionList = [];
  const hourMap = {};
  const sentimentStats = { positive: 0, neutral: 0, negative: 0, unrecognized: 0 };
  const emotionStats = {};
  const intentStats = {};
  const typeStats = {};
  const chatTypeStats = {};
  const groupStats = {};
  const sentimentByType = {};
  const sentimentByChatType = {};
  const sentimentByGroup = {};
  const toxicMessagesMap = {};
  const messageCountMap = {};
  const toxicUserMap = {};

  let botMessages = 0;
  let toxicCount = 0;
  let totalWords = 0;
  let totalChars = 0;

  function updateSentimentMap(map, key, sentiment) {
    if (!map[key]) map[key] = { positive: 0, neutral: 0, negative: 0, unrecognized: 0 };
    map[key][sentiment]++;
  }
  
  const spamScamStats = { spam: 0, scam: 0, "scam+spam": 0 };
  const spamScamMessages = [];

  for (const msg of messages) {
    const text = msg.content || "";
    const lowerText = text.toLowerCase();
	
	let matchedTech = null;
	let matchedTechCount = 0;
	const matchedProducts = [];
	for (const [tech, products] of Object.entries(productMap)) {
	  let count = 0;
	  for (const product of products) {
		const regex = new RegExp(`\\b${product}\\b`, "i");
		if (regex.test(text)) {
		  matchedProducts.push(product);
		  productMentionCount[product] = (productMentionCount[product] || 0) + 1;
		  count++;
		}
	  }
	  if (count > 0) {
		techMentionCount[tech] = (techMentionCount[tech] || 0) + count;
		if (count > matchedTechCount) {
		  matchedTech = tech;
		  matchedTechCount = count;
		}
	  }
	}
	
	const spamScamType = detectSpamScam(text);
	if (spamScamType !== "none") {
	  spamScamStats[spamScamType]++;
	  spamScamMessages.push({ text, type: spamScamType });
	}

    const type = msg.type || "Unknown";
    const chatType = msg.chatType || "Unknown";
    const group = msg.group || "Unknown";
    const timestamp = msg.timestamp || null;

    if (msg.sender === "Bot") botMessages++;
    if (timestamp) {
      const hour = new Date(timestamp).getHours();
      hourMap[hour] = (hourMap[hour] || 0) + 1;
    }

    typeStats[type] = (typeStats[type] || 0) + 1;
    chatTypeStats[chatType] = (chatTypeStats[chatType] || 0) + 1;
    groupStats[group] = (groupStats[group] || 0) + 1;

    totalChars += text.length;
    const words = text.split(/\s+/);
    totalWords += words.length;

    const intent = detectIntent(text);
    intentStats[intent] = (intentStats[intent] || 0) + 1;

    const emotion = detectEmotion(text);
    emotionStats[emotion] = (emotionStats[emotion] || 0) + 1;

    const isQuestion =
      text.includes("?") ||
      lowerText.startsWith("apa") ||
      lowerText.startsWith("bagaimana") ||
      lowerText.startsWith("kenapa") ||
      lowerText.startsWith("mengapa") ||
      lowerText.startsWith("dimana") ||
      lowerText.startsWith("kapan") ||
      lowerText.startsWith("siapa") ||
      lowerText.startsWith("berapa") ||
      lowerText.startsWith("dapatkah") ||
      lowerText.startsWith("bisakah") ||
      lowerText.startsWith("mungkinkah");

    if (isQuestion && text.length < 150) {
      questionList.push(text);
    }

	if (badWords.some(word => lowerText.includes(word))) {
	  toxicCount++;
	  toxicMessagesMap[text] = (toxicMessagesMap[text] || 0) + 1;

	  const sender = msg.sender || "Unknown";
	  toxicUserMap[sender] = (toxicUserMap[sender] || 0) + 1;
	}

    const messageKey = text.trim().toLowerCase();
    messageCountMap[messageKey] = (messageCountMap[messageKey] || 0) + 1;

    let sentiment = "neutral";
    if (!text || lowerText.includes("tidak dikenali")) {
      sentiment = "unrecognized";
      sentimentStats.unrecognized++;
    } else {
      const result = sentimentAnalyzer.analyze(text);
      if (result.score >= 2) sentiment = "positive";
      else if (result.score <= -2) sentiment = "negative";
      sentimentStats[sentiment]++;

      const doc = nlp(text);
      const nouns = doc.nouns().out("array");
      nouns.forEach(raw => {
        const noun = normalizeWord(raw);
        if (noun && noun.length > 2 && !stopwords.has(noun)) {
          nounMap[noun] = (nounMap[noun] || 0) + 1;
        }
      });
    }

    updateSentimentMap(sentimentByType, type, sentiment);
    updateSentimentMap(sentimentByChatType, chatType, sentiment);
    updateSentimentMap(sentimentByGroup, group, sentiment);
  }

  const sortedTopics = Object.entries(nounMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([topic, count]) => ({ topic: segmentWord(topic), count }));

  const peakHours = Object.entries(hourMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([hour, count]) => ({ hour: `${hour}:00`, count }));

  const repeatedMessages = Object.entries(messageCountMap)
	.filter(([text, count]) =>
		count > 2 && !/\[.*?\]/.test(text)
	)
	.map(([text, count]) => ({ text, count }))
	.slice(0, 5);

  const topToxicMessages = Object.entries(toxicMessagesMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([text, count]) => ({ text, count }));
	
  const topToxicUsers = Object.entries(toxicUserMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([sender, count]) => ({ sender, count }));

  return {
    messagesAnalyzed: messages.length,
    botMessages,
    avgWordsPerMessage: Number(totalWords / messages.length).toFixed(2),
    avgCharsPerMessage: Number(totalChars / messages.length).toFixed(2),
    sentimentStats,
    sentimentByGroup,
    sentimentByChatType,
    sentimentByType,
    groupStats,
    chatTypeStats,
    typeStats,
    emotionStats,
    intentStats,
    topTopics: sortedTopics,
    topQuestions: questionList.slice(0, 12),
    peakHours,
    toxicMessages: toxicCount,
    topToxicMessages,
	topToxicUsers,
    repeatedMessages,
	spamScamStats,
	spamScamMessages: spamScamMessages.slice(0, 12),
	topTechnologies: Object.entries(techMentionCount).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([tech, count]) => ({ tech, count })),
	topProducts: Object.entries(productMentionCount).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([product, count]) => ({ product, count })),
  };
}

module.exports = analyzeMessages;
