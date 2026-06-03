// Legacy curated examples kept for richer text where characters overlap the 1000-character set.
const legacyCharacterDatabase = [
    // Basic Chinese Characters - Pronouns and Common Words
    { char: '我', pinyin: 'wǒ', strokes: 7, meaning: 'I, me; self', example: 'I am a student', category: 'basic' },
    { char: '你', pinyin: 'nǐ', strokes: 6, meaning: 'You', example: 'Hello', category: 'basic' },
    { char: '他', pinyin: 'tā', strokes: 5, meaning: 'He, him', example: 'He is smart', category: 'basic' },
    { char: '她', pinyin: 'tā', strokes: 6, meaning: 'She, her', example: 'She is a doctor', category: 'basic' },
    { char: '是', pinyin: 'shì', strokes: 9, meaning: 'Is, to be (verb)', example: 'This is a book', category: 'basic' },
    { char: '有', pinyin: 'yǒu', strokes: 6, meaning: 'Have, has; possess', example: 'I have a cat', category: 'basic' },
    { char: '在', pinyin: 'zài', strokes: 6, meaning: 'At, in; be located', example: 'I am home', category: 'basic' },
    { char: '的', pinyin: 'de', strokes: 8, meaning: '(Possessive particle)', example: 'My book', category: 'basic' },
    { char: '和', pinyin: 'hé', strokes: 8, meaning: 'And, with', example: 'You and me', category: 'basic' },
    { char: '了', pinyin: 'le', strokes: 2, meaning: '(Completion particle)', example: 'I came', category: 'basic' },
    { char: '不', pinyin: 'bù', strokes: 4, meaning: 'Not, no; negation', example: 'Not good', category: 'basic' },
    { char: '人', pinyin: 'rén', strokes: 2, meaning: 'Person, human', example: 'One person', category: 'basic' },
    { char: '大', pinyin: 'dà', strokes: 3, meaning: 'Big, large', example: 'Big tree', category: 'basic' },
    { char: '小', pinyin: 'xiǎo', strokes: 3, meaning: 'Small, little', example: 'Small cat', category: 'basic' },
    { char: '多', pinyin: 'duō', strokes: 6, meaning: 'Many, much', example: 'Many people', category: 'basic' },
    { char: '少', pinyin: 'shǎo', strokes: 4, meaning: 'Few, little; few in number', example: 'Rarely seen', category: 'basic' },
    { char: '好', pinyin: 'hǎo', strokes: 6, meaning: 'Good, well', example: 'Very good', category: 'basic' },
    { char: '坏', pinyin: 'huài', strokes: 7, meaning: 'Bad, evil; not good', example: 'Bad weather', category: 'basic' },

    // Verbs and Actions
    { char: '做', pinyin: 'zuò', strokes: 11, meaning: 'Do, make; take action', example: 'Do homework', category: 'basic' },
    { char: '来', pinyin: 'lái', strokes: 7, meaning: 'Come; arrive', example: 'Come on', category: 'basic' },
    { char: '去', pinyin: 'qù', strokes: 5, meaning: 'Go; depart', example: 'Go to school', category: 'basic' },
    { char: '说', pinyin: 'shuō', strokes: 9, meaning: 'Say, speak; talk', example: 'Talk', category: 'basic' },
    { char: '看', pinyin: 'kàn', strokes: 9, meaning: 'Look, see; watch', example: 'Read a book', category: 'basic' },
    { char: '听', pinyin: 'tīng', strokes: 7, meaning: 'Hear, listen', example: 'Listen to music', category: 'basic' },
    { char: '学', pinyin: 'xué', strokes: 8, meaning: 'Learn, study', example: 'Study Chinese', category: 'basic' },
    { char: '读', pinyin: 'dú', strokes: 10, meaning: 'Read; pronounce', example: 'Read books', category: 'basic' },
    { char: '写', pinyin: 'xiě', strokes: 5, meaning: 'Write; compose', example: 'Write characters', category: 'basic' },
    { char: '画', pinyin: 'huà', strokes: 8, meaning: 'Paint, draw; picture', example: 'Draw pictures', category: 'basic' },
    { char: '唱', pinyin: 'chàng', strokes: 10, meaning: 'Sing; chant', example: 'Sing songs', category: 'basic' },
    { char: '跑', pinyin: 'pǎo', strokes: 12, meaning: 'Run; flee', example: 'Run', category: 'basic' },
    { char: '走', pinyin: 'zǒu', strokes: 7, meaning: 'Walk, go; leave', example: 'Walk', category: 'basic' },
    { char: '坐', pinyin: 'zuò', strokes: 7, meaning: 'Sit; be seated', example: 'Sit down', category: 'basic' },
    { char: '站', pinyin: 'zhàn', strokes: 10, meaning: 'Stand; stand up', example: 'Stand', category: 'basic' },
    { char: '睡', pinyin: 'shuì', strokes: 13, meaning: 'Sleep; sleepy', example: 'Sleep', category: 'basic' },
    { char: '吃', pinyin: 'chī', strokes: 6, meaning: 'Eat; consume', example: 'Eat rice', category: 'basic' },
    { char: '喝', pinyin: 'hē', strokes: 12, meaning: 'Drink; sip', example: 'Drink water', category: 'basic' },
    { char: '买', pinyin: 'mǎi', strokes: 6, meaning: 'Buy; purchase', example: 'Buy things', category: 'basic' },
    { char: '卖', pinyin: 'mài', strokes: 8, meaning: 'Sell; vend', example: 'Sell things', category: 'basic' },

    // Animals
    { char: '猫', pinyin: 'māo', strokes: 11, meaning: 'Cat; feline', example: 'Domestic cat', category: 'animals' },
    { char: '狗', pinyin: 'gǒu', strokes: 8, meaning: 'Dog; canine', example: 'Puppy', category: 'animals' },
    { char: '鱼', pinyin: 'yú', strokes: 8, meaning: 'Fish; aquatic animal', example: 'Goldfish', category: 'animals' },
    { char: '鸟', pinyin: 'niǎo', strokes: 11, meaning: 'Bird; avian', example: 'Little bird', category: 'animals' },
    { char: '象', pinyin: 'xiàng', strokes: 12, meaning: 'Elephant; large animal', example: 'Elephant', category: 'animals' },
    { char: '牛', pinyin: 'niú', strokes: 4, meaning: 'Ox, cow; cattle', example: 'Water buffalo', category: 'animals' },
    { char: '马', pinyin: 'mǎ', strokes: 10, meaning: 'Horse; equine', example: 'Steed', category: 'animals' },
    { char: '羊', pinyin: 'yáng', strokes: 6, meaning: 'Sheep, goat; ovine', example: 'Flock of sheep', category: 'animals' },
    { char: '猪', pinyin: 'zhū', strokes: 11, meaning: 'Pig; porcine', example: 'Piglet', category: 'animals' },
    { char: '鸡', pinyin: 'jī', strokes: 7, meaning: 'Chicken; poultry', example: 'Hen', category: 'animals' },
    { char: '兔', pinyin: 'tù', strokes: 8, meaning: 'Rabbit; bunny', example: 'Little rabbit', category: 'animals' },
    { char: '熊', pinyin: 'xióng', strokes: 13, meaning: 'Bear; ursine', example: 'Big bear', category: 'animals' },
    { char: '老', pinyin: 'lǎo', strokes: 6, meaning: 'Old; aged', example: 'Mouse', category: 'animals' },
    { char: '鼠', pinyin: 'shǔ', strokes: 13, meaning: 'Mouse, rat; rodent', example: 'Mouse', category: 'animals' },
    { char: '蛇', pinyin: 'shé', strokes: 11, meaning: 'Snake; serpent', example: 'Venomous snake', category: 'animals' },
    { char: '龙', pinyin: 'lóng', strokes: 16, meaning: 'Dragon; mythical', example: 'Chinese dragon', category: 'animals' },
    { char: '虎', pinyin: 'hǔ', strokes: 6, meaning: 'Tiger; feline', example: 'Tiger', category: 'animals' },
    { char: '猴', pinyin: 'hóu', strokes: 12, meaning: 'Monkey; primate', example: 'Monkey', category: 'animals' },
    { char: '蛙', pinyin: 'wā', strokes: 13, meaning: 'Frog; amphibian', example: 'Toad/Frog', category: 'animals' },
    { char: '蜂', pinyin: 'fēng', strokes: 13, meaning: 'Bee; insect', example: 'Honeybee', category: 'animals' },

    // Nature - Astronomy and Geography
    { char: '山', pinyin: 'shān', strokes: 3, meaning: 'Mountain; highland', example: 'High mountain', category: 'nature' },
    { char: '水', pinyin: 'shuǐ', strokes: 4, meaning: 'Water; liquid', example: 'River water', category: 'nature' },
    { char: '火', pinyin: 'huǒ', strokes: 4, meaning: 'Fire; heat', example: 'Build a fire', category: 'nature' },
    { char: '木', pinyin: 'mù', strokes: 4, meaning: 'Wood; tree; timber', example: 'Trees', category: 'nature' },
    { char: '土', pinyin: 'tǔ', strokes: 3, meaning: 'Earth; soil; clay', example: 'Land', category: 'nature' },
    { char: '天', pinyin: 'tiān', strokes: 4, meaning: 'Sky, heaven; day', example: 'Clear day', category: 'nature' },
    { char: '地', pinyin: 'dì', strokes: 6, meaning: 'Land, earth; ground', example: 'The earth', category: 'nature' },
    { char: '云', pinyin: 'yún', strokes: 4, meaning: 'Cloud; mist', example: 'White cloud', category: 'nature' },
    { char: '雨', pinyin: 'yǔ', strokes: 8, meaning: 'Rain; rainfall', example: 'It is raining', category: 'nature' },
    { char: '风', pinyin: 'fēng', strokes: 4, meaning: 'Wind; breeze', example: 'Strong wind', category: 'nature' },
    { char: '雪', pinyin: 'xuě', strokes: 11, meaning: 'Snow; snowflake', example: 'It is snowing', category: 'nature' },
    { char: '冰', pinyin: 'bīng', strokes: 5, meaning: 'Ice; frozen', example: 'Ice water', category: 'nature' },
    { char: '雷', pinyin: 'léi', strokes: 13, meaning: 'Thunder; lightning', example: 'Thunder', category: 'nature' },
    { char: '电', pinyin: 'diàn', strokes: 5, meaning: 'Electricity; power', example: 'Electric light', category: 'nature' },
    { char: '光', pinyin: 'guāng', strokes: 6, meaning: 'Light; ray; shine', example: 'Sunshine', category: 'nature' },
    { char: '月', pinyin: 'yuè', strokes: 4, meaning: 'Moon; lunar', example: 'Moon', category: 'nature' },
    { char: '星', pinyin: 'xīng', strokes: 5, meaning: 'Star; celestial', example: 'Star', category: 'nature' },
    { char: '日', pinyin: 'rì', strokes: 4, meaning: 'Sun; day; daily', example: 'Every day', category: 'nature' },
    { char: '太', pinyin: 'tài', strokes: 4, meaning: 'Too; very; excessively', example: 'Very good', category: 'nature' },
    { char: '阳', pinyin: 'yáng', strokes: 6, meaning: 'Sun, sunlight; yang', example: 'Sunlight', category: 'nature' },
    { char: '阴', pinyin: 'yīn', strokes: 6, meaning: 'Shade, shadow; yin', example: 'Rainy', category: 'nature' },
    { char: '晴', pinyin: 'qíng', strokes: 12, meaning: 'Clear; sunny', example: 'Clear day', category: 'nature' },
    { char: '夜', pinyin: 'yè', strokes: 8, meaning: 'Night; evening', example: 'Night time', category: 'nature' },
    { char: '早', pinyin: 'zǎo', strokes: 6, meaning: 'Early; morning', example: 'Morning', category: 'nature' },
    { char: '晨', pinyin: 'chén', strokes: 11, meaning: 'Dawn; early morning', example: 'Early morning', category: 'nature' },

    // Numbers 
    { char: '一', pinyin: 'yī', strokes: 1, meaning: 'Number: one; 1', example: 'One object', category: 'numbers' },
    { char: '二', pinyin: 'èr', strokes: 2, meaning: 'Number: two; 2', example: 'Second', category: 'numbers' },
    { char: '三', pinyin: 'sān', strokes: 3, meaning: 'Number: three; 3', example: 'Three objects', category: 'numbers' },
    { char: '四', pinyin: 'sì', strokes: 5, meaning: 'Number: four; 4', example: '四个', category: 'numbers' },
    { char: '五', pinyin: 'wǔ', strokes: 4, meaning: 'Number: five; 5', example: '五个', category: 'numbers' },
    { char: '六', pinyin: 'liù', strokes: 4, meaning: 'Number: six; 6', example: '六个', category: 'numbers' },
    { char: '七', pinyin: 'qī', strokes: 2, meaning: 'Number: seven; 7', example: '七个', category: 'numbers' },
    { char: '八', pinyin: 'bā', strokes: 2, meaning: 'Number: eight; 8', example: '八个', category: 'numbers' },
    { char: '九', pinyin: 'jiǔ', strokes: 2, meaning: 'Number: nine; 9', example: '九个', category: 'numbers' },
    { char: '十', pinyin: 'shí', strokes: 2, meaning: 'Number: ten; 10', example: '十个', category: 'numbers' },
    { char: '百', pinyin: 'bǎi', strokes: 6, meaning: 'Number: hundred; 100', example: '一百', category: 'numbers' },
    { char: '千', pinyin: 'qiān', strokes: 3, meaning: 'Number: thousand; 1000', example: '一千', category: 'numbers' },
    { char: '万', pinyin: 'wàn', strokes: 3, meaning: 'Number: ten thousand; 10000', example: '万个', category: 'numbers' },

    // Food and Objects
    { char: '米', pinyin: 'mǐ', strokes: 6, meaning: 'Rice; grain', example: '米饭', category: 'basic' },
    { char: '饭', pinyin: 'fàn', strokes: 12, meaning: 'Rice; meal', example: '吃饭', category: 'basic' },
    { char: '菜', pinyin: 'cài', strokes: 11, meaning: 'Vegetable; dish', example: '吃菜', category: 'basic' },
    { char: '肉', pinyin: 'ròu', strokes: 6, meaning: 'Meat; flesh', example: '吃肉', category: 'basic' },
    { char: '鱼', pinyin: 'yú', strokes: 8, meaning: 'Fish; meat', example: '吃鱼', category: 'basic' },
    { char: '蛋', pinyin: 'dàn', strokes: 11, meaning: 'Egg; ovum', example: 'Egg', category: 'basic' },
    { char: '面', pinyin: 'miàn', strokes: 9, meaning: 'Noodles; face', example: '吃面', category: 'basic' },
    { char: '包', pinyin: 'bāo', strokes: 5, meaning: 'Bun; steamed bun', example: '包子', category: 'basic' },
    { char: '糖', pinyin: 'táng', strokes: 16, meaning: 'Sugar; candy', example: '吃糖', category: 'basic' },
    { char: '果', pinyin: 'guǒ', strokes: 8, meaning: 'Fruit; produce', example: '水果', category: 'basic' },
    { char: '茶', pinyin: 'chá', strokes: 10, meaning: 'Tea; tea leaves', example: '喝茶', category: 'basic' },
    { char: '酒', pinyin: 'jiǔ', strokes: 10, meaning: 'Alcohol; wine', example: '喝酒', category: 'basic' },
    { char: '果', pinyin: 'guǒ', strokes: 8, meaning: 'Fruit; result', example: '果子', category: 'basic' },
    { char: '苹', pinyin: 'píng', strokes: 8, meaning: 'Apple; peaceful', example: 'Apple', category: 'basic' },
    { char: '梨', pinyin: 'lí', strokes: 11, meaning: 'Pear; tree', example: '吃梨', category: 'basic' },
    { char: '桃', pinyin: 'táo', strokes: 10, meaning: 'Peach; fruit', example: '桃子', category: 'basic' },
    { char: '瓜', pinyin: 'guā', strokes: 5, meaning: 'Melon; gourd', example: 'Watermelon', category: 'basic' },
    { char: '橙', pinyin: 'chéng', strokes: 16, meaning: 'Orange; tangerine', example: '橙子', category: 'basic' },

    // Clothing and Body
    { char: '衣', pinyin: 'yī', strokes: 6, meaning: 'Clothes; clothing', example: 'Clothing', category: 'basic' },
    { char: '裤', pinyin: 'kù', strokes: 13, meaning: 'Pants; trousers', example: 'Pants', category: 'basic' },
    { char: '鞋', pinyin: 'xié', strokes: 15, meaning: 'Shoe; footwear', example: 'Shoes', category: 'basic' },
    { char: '帽', pinyin: 'mào', strokes: 12, meaning: 'Hat; cap; cover', example: '帽子', category: 'basic' },
    { char: '头', pinyin: 'tóu', strokes: 5, meaning: 'Head; top', example: '头发', category: 'basic' },
    { char: '发', pinyin: 'fā', strokes: 12, meaning: 'Hair; send', example: '头发', category: 'basic' },
    { char: '眼', pinyin: 'yǎn', strokes: 11, meaning: 'Eye; sight', example: '眼睛', category: 'basic' },
    { char: '耳', pinyin: 'ěr', strokes: 6, meaning: 'Ear; hearing', example: '耳朵', category: 'basic' },
    { char: '鼻', pinyin: 'bí', strokes: 14, meaning: 'Nose; olfaction', example: 'Nose', category: 'basic' },
    { char: '口', pinyin: 'kǒu', strokes: 3, meaning: 'Mouth; oral', example: '嘴巴', category: 'basic' },
    { char: '牙', pinyin: 'yá', strokes: 4, meaning: 'Tooth; teeth', example: '牙齿', category: 'basic' },
    { char: '舌', pinyin: 'shé', strokes: 6, meaning: 'Tongue', example: 'Tongue', category: 'basic' },
    { char: '手', pinyin: 'shǒu', strokes: 4, meaning: 'Hand', example: '手指', category: 'basic' },
    { char: '脚', pinyin: 'jiǎo', strokes: 11, meaning: 'Foot; leg', example: '脚', category: 'basic' },
    { char: '心', pinyin: 'xīn', strokes: 4, meaning: 'Heart; mind', example: '心', category: 'basic' },
    { char: '肺', pinyin: 'fèi', strokes: 10, meaning: 'Lung', example: '肺', category: 'basic' },
    { char: '肝', pinyin: 'gān', strokes: 7, meaning: 'Liver', example: '肝脏', category: 'basic' },
    { char: '胃', pinyin: 'wèi', strokes: 9, meaning: 'Stomach', example: '胃', category: 'basic' },
    { char: '骨', pinyin: 'gǔ', strokes: 10, meaning: 'Bone', example: 'Bone', category: 'basic' },
    { char: '血', pinyin: 'xiě', strokes: 6, meaning: 'Blood', example: 'Blood', category: 'basic' },

    // Family and Relationships
    { char: '父', pinyin: 'fù', strokes: 4, meaning: 'Father; dad', example: 'Dad', category: 'basic' },
    { char: '母', pinyin: 'mǔ', strokes: 5, meaning: 'Mother; mom', example: 'Mom', category: 'basic' },
    { char: '爸', pinyin: 'bà', strokes: 8, meaning: 'Dad; pop', example: 'Daddy', category: 'basic' },
    { char: '妈', pinyin: 'mā', strokes: 6, meaning: 'Mom; ma', example: 'Mommy', category: 'basic' },
    { char: '哥', pinyin: 'gē', strokes: 10, meaning: 'Older brother', example: 'Older brother', category: 'basic' },
    { char: '弟', pinyin: 'dì', strokes: 7, meaning: 'Younger brother', example: 'Younger brother', category: 'basic' },
    { char: '姐', pinyin: 'jiě', strokes: 8, meaning: 'Older sister', example: 'Older sister', category: 'basic' },
    { char: '妹', pinyin: 'mèi', strokes: 8, meaning: 'Younger sister', example: 'Younger sister', category: 'basic' },
    { char: '子', pinyin: 'zǐ', strokes: 3, meaning: 'Son; child', example: 'Son', category: 'basic' },
    { char: '女', pinyin: 'nǚ', strokes: 3, meaning: 'Daughter; female', example: 'Daughter', category: 'basic' },
    { char: '婚', pinyin: 'hūn', strokes: 11, meaning: 'Marriage; wedding', example: 'Wedding', category: 'basic' },
    { char: '爱', pinyin: 'ài', strokes: 10, meaning: 'Love; affection', example: 'Love/like', category: 'basic' },
    { char: '亲', pinyin: 'qīn', strokes: 16, meaning: 'Relative; close', example: 'Relatives', category: 'basic' },
    { char: '朋', pinyin: 'péng', strokes: 8, meaning: 'Friend (first char)', example: 'Friend', category: 'basic' },
    { char: '友', pinyin: 'yǒu', strokes: 4, meaning: 'Friend; friendship', example: 'Friendship', category: 'basic' },

    // School and Education
    { char: '校', pinyin: 'xiào', strokes: 10, meaning: 'School; academy', example: 'School', category: 'basic' },
    { char: '班', pinyin: 'bān', strokes: 10, meaning: 'Class; grade', example: 'Class', category: 'basic' },
    { char: '级', pinyin: 'jí', strokes: 9, meaning: 'Grade; level', example: 'Grade/Year', category: 'basic' },
    { char: '书', pinyin: 'shū', strokes: 4, meaning: 'Book; writing', example: 'Book', category: 'basic' },
    { char: '笔', pinyin: 'bǐ', strokes: 10, meaning: 'Pen; pencil', example: 'Pen', category: 'basic' },
    { char: '纸', pinyin: 'zhǐ', strokes: 10, meaning: 'Paper; sheet', example: 'Paper', category: 'basic' },
    { char: '字', pinyin: 'zì', strokes: 6, meaning: 'Character; word', example: 'Character', category: 'basic' },
    { char: '词', pinyin: 'cí', strokes: 10, meaning: 'Word; phrase', example: 'Word', category: 'basic' },
    { char: '题', pinyin: 'tí', strokes: 15, meaning: 'Question; subject', example: 'Question', category: 'basic' },
    { char: '答', pinyin: 'dá', strokes: 12, meaning: 'Answer; reply', example: 'Answer', category: 'basic' },
    { char: '考', pinyin: 'kǎo', strokes: 6, meaning: 'Exam; test', example: 'Test', category: 'basic' },
    { char: '试', pinyin: 'shì', strokes: 13, meaning: 'Exam; try', example: 'Exam', category: 'basic' },
    { char: '分', pinyin: 'fēn', strokes: 4, meaning: 'Score; grade; point', example: 'Score', category: 'basic' },
    { char: '数', pinyin: 'shù', strokes: 13, meaning: 'Math; number', example: 'Math', category: 'basic' },
    { char: '英', pinyin: 'yīng', strokes: 8, meaning: 'English; Britain', example: 'English', category: 'basic' },
    { char: '语', pinyin: 'yǔ', strokes: 14, meaning: 'Language; speech', example: 'Language', category: 'basic' },

    // Colors
    { char: '红', pinyin: 'hóng', strokes: 6, meaning: 'Red', example: '红色', category: 'basic' },
    { char: '绿', pinyin: 'lǜ', strokes: 14, meaning: 'Green', example: '绿色', category: 'basic' },
    { char: '蓝', pinyin: 'lán', strokes: 13, meaning: 'Blue', example: 'Blue color', category: 'basic' },
    { char: '黄', pinyin: 'huáng', strokes: 11, meaning: 'Yellow', example: 'Yellow', category: 'basic' },
    { char: '白', pinyin: 'bái', strokes: 5, meaning: 'White', example: '白色', category: 'basic' },
    { char: '黑', pinyin: 'hēi', strokes: 12, meaning: 'Black', example: 'Black', category: 'basic' },
    { char: '灰', pinyin: 'huī', strokes: 6, meaning: 'Gray', example: '灰色', category: 'basic' },
    { char: '紫', pinyin: 'zǐ', strokes: 12, meaning: 'Purple', example: '紫色', category: 'basic' },
    { char: '橙', pinyin: 'chéng', strokes: 16, meaning: 'Orange', example: '橙色', category: 'basic' },
    { char: '粉', pinyin: 'fěn', strokes: 10, meaning: 'Pink; powder', example: '粉色', category: 'basic' },

    // Seasons and Time
    { char: '春', pinyin: 'chūn', strokes: 9, meaning: 'Spring; season', example: 'Spring', category: 'nature' },
    { char: '夏', pinyin: 'xià', strokes: 10, meaning: 'Summer; hot season', example: 'Summer', category: 'nature' },
    { char: '秋', pinyin: 'qiū', strokes: 9, meaning: 'Autumn; fall', example: 'Autumn', category: 'nature' },
    { char: '冬', pinyin: 'dōng', strokes: 5, meaning: 'Winter; cold', example: 'Winter', category: 'nature' },
    { char: '年', pinyin: 'nián', strokes: 6, meaning: 'Year; annual', example: 'This year', category: 'basic' },
    { char: '月', pinyin: 'yuè', strokes: 4, meaning: 'Month; lunar', example: 'January', category: 'basic' },
    { char: '日', pinyin: 'rì', strokes: 4, meaning: 'Day; sun; date', example: 'Today', category: 'basic' },
    { char: '周', pinyin: 'zhōu', strokes: 8, meaning: 'Week; period', example: 'This week', category: 'basic' },
    { char: '小', pinyin: 'xiǎo', strokes: 3, meaning: 'Small; hour', example: 'Hour', category: 'basic' },
    { char: '时', pinyin: 'shí', strokes: 10, meaning: 'Time; hour', example: 'Time', category: 'basic' },
    { char: '分', pinyin: 'fēn', strokes: 4, meaning: 'Minute; part', example: 'Minute', category: 'basic' },
    { char: '秒', pinyin: 'miǎo', strokes: 9, meaning: 'Second; instant', example: 'Second', category: 'basic' },
    { char: '刻', pinyin: 'kè', strokes: 8, meaning: 'Time; quarter; carve', example: '15 minutes', category: 'basic' },

    // Places and Buildings
    { char: '家', pinyin: 'jiā', strokes: 10, meaning: 'Home; family', example: '我的家', category: 'basic' },
    { char: '房', pinyin: 'fáng', strokes: 8, meaning: 'House; room', example: '房子', category: 'basic' },
    { char: '门', pinyin: 'mén', strokes: 4, meaning: 'Door; gate', example: '打开门', category: 'basic' },
    { char: '窗', pinyin: 'chuāng', strokes: 11, meaning: 'Window', example: '窗户', category: 'basic' },
    { char: '墙', pinyin: 'qiáng', strokes: 14, meaning: 'Wall', example: '墙壁', category: 'basic' },
    { char: '床', pinyin: 'chuáng', strokes: 7, meaning: 'Bed', example: '床', category: 'basic' },
    { char: '桌', pinyin: 'zhuō', strokes: 10, meaning: 'Table; desk', example: '桌子', category: 'basic' },
    { char: '椅', pinyin: 'yǐ', strokes: 12, meaning: 'Chair', example: '椅子', category: 'basic' },
    { char: '灯', pinyin: 'dēng', strokes: 6, meaning: 'Lamp; light', example: '电灯', category: 'basic' },
    { char: '路', pinyin: 'lù', strokes: 13, meaning: 'Road; path', example: 'Street', category: 'basic' },
    { char: '街', pinyin: 'jiē', strokes: 12, meaning: 'Street', example: 'Street', category: 'basic' },
    { char: '店', pinyin: 'diàn', strokes: 8, meaning: 'Store; shop', example: '商店', category: 'basic' },
    { char: '公', pinyin: 'gōng', strokes: 4, meaning: 'Public; fair', example: '公园', category: 'basic' },
    { char: '园', pinyin: 'yuán', strokes: 13, meaning: 'Garden; park', example: '公园', category: 'basic' },
    { char: '医', pinyin: 'yī', strokes: 7, meaning: 'Medicine; doctor-related', example: '医院', category: 'basic' },
    { char: '院', pinyin: 'yuàn', strokes: 10, meaning: 'Hospital; courtyard; institute', example: '医院', category: 'basic' },
    { char: '工', pinyin: 'gōng', strokes: 3, meaning: 'Work; worker; craft', example: '工作', category: 'basic' },
    { char: '厂', pinyin: 'chǎng', strokes: 2, meaning: 'Factory', example: '工厂', category: 'basic' },

    // Transportation
    { char: '车', pinyin: 'chē', strokes: 4, meaning: 'Car; vehicle', example: '汽车', category: 'basic' },
    { char: '火', pinyin: 'huǒ', strokes: 4, meaning: 'Fire; train-related in compounds', example: '火车', category: 'basic' },
    { char: '船', pinyin: 'chuán', strokes: 11, meaning: 'Boat; ship', example: '小船', category: 'basic' },
    { char: '飞', pinyin: 'fēi', strokes: 3, meaning: 'Fly; airplane-related', example: 'Airplane', category: 'basic' },
    { char: '机', pinyin: 'jī', strokes: 6, meaning: 'Machine; airplane-related', example: 'Airplane', category: 'basic' },
    { char: '自', pinyin: 'zì', strokes: 6, meaning: 'Self; oneself', example: 'Bicycle', category: 'basic' },
    { char: '行', pinyin: 'xíng', strokes: 6, meaning: 'Walk; go; line', example: 'Walking', category: 'basic' },
    { char: '二', pinyin: 'èr', strokes: 2, meaning: 'Two; second', example: 'Bicycle', category: 'basic' },
    { char: '轮', pinyin: 'lún', strokes: 8, meaning: 'Wheel; turn', example: 'Wheel', category: 'basic' },
    { char: '轮', pinyin: 'lún', strokes: 8, meaning: 'Wheel; tire-related', example: 'Tire', category: 'basic' },

    // Professions
    { char: '医', pinyin: 'yī', strokes: 7, meaning: 'Medicine; doctor-related', example: '医生', category: 'basic' },
    { char: '师', pinyin: 'shī', strokes: 10, meaning: 'Teacher; master', example: '老师', category: 'basic' },
    { char: '工', pinyin: 'gōng', strokes: 3, meaning: 'Work; worker; craft', example: '工人', category: 'basic' },
    { char: '农', pinyin: 'nóng', strokes: 6, meaning: 'Farmer; farming', example: '农民', category: 'basic' },
    { char: '民', pinyin: 'mín', strokes: 5, meaning: 'People; citizen', example: '人民', category: 'basic' },
    { char: '商', pinyin: 'shāng', strokes: 11, meaning: 'Business; merchant', example: '商人', category: 'basic' },
    { char: '兵', pinyin: 'bīng', strokes: 7, meaning: 'Soldier', example: '士兵', category: 'basic' },
    { char: '士', pinyin: 'shì', strokes: 3, meaning: 'Scholar; soldier; gentleman', example: '士兵', category: 'basic' },
    { char: '警', pinyin: 'jǐng', strokes: 12, meaning: 'Police; warning', example: 'Police', category: 'basic' },
    { char: '察', pinyin: 'chá', strokes: 14, meaning: 'Observe; inspect; police-related', example: 'Police', category: 'basic' },
    { char: '空', pinyin: 'kōng', strokes: 8, meaning: 'Empty; sky; air', example: '空姐', category: 'basic' },
    { char: '姐', pinyin: 'jiě', strokes: 8, meaning: 'Older sister', example: '空姐', category: 'basic' },
    { char: '司', pinyin: 'sī', strokes: 5, meaning: 'Manage; company-related', example: '司机', category: 'basic' },
    { char: '机', pinyin: 'jī', strokes: 6, meaning: 'Machine; airplane-related', example: '司机', category: 'basic' },
    { char: '厨', pinyin: 'chú', strokes: 12, meaning: 'Kitchen; cook', example: '厨师', category: 'basic' },
    { char: '种', pinyin: 'zhǒng', strokes: 9, meaning: 'Kind; type; seed', example: '种类', category: 'basic' },

    // Other Common Characters
    { char: '里', pinyin: 'lǐ', strokes: 7, meaning: 'Inside; Chinese mile', example: '几里', category: 'basic' },
    { char: '个', pinyin: 'ge', strokes: 3, meaning: 'Measure word for people or things', example: 'One object', category: 'basic' },
    { char: '两', pinyin: 'liǎng', strokes: 5, meaning: 'Two; both', example: '两个', category: 'basic' },
    { char: '种', pinyin: 'zhǒng', strokes: 9, meaning: 'Kind; type; seed', example: '一种', category: 'basic' },
    { char: '只', pinyin: 'zhī', strokes: 5, meaning: 'Measure word; only', example: '一只', category: 'basic' },
    { char: '次', pinyin: 'cì', strokes: 6, meaning: 'Time; occurrence; order', example: '一次', category: 'basic' },
    { char: '回', pinyin: 'huí', strokes: 6, meaning: 'Return; time; reply', example: '一回', category: 'basic' },
    { char: '面', pinyin: 'miàn', strokes: 9, meaning: 'Noodles; face', example: '吃面', category: 'basic' },
    { char: '块', pinyin: 'kuài', strokes: 7, meaning: 'Piece; chunk; block', example: '一块', category: 'basic' },
    { char: '件', pinyin: 'jiàn', strokes: 6, meaning: 'Measure word for items', example: '一件', category: 'basic' },
];

const COMMON_1000_CHARS = '的是不我一有大在人了中到资要以可这个你会好为上来学就交也用能如时文说没他看那问生提下过请们天所多么小之想得工出还电对都机自而子后讯家站心只去知国很台成信同何章道发地法无然但当于吗本年现前最真新和因果意定点情其题事科方些清三样此吧位作理行者经名什谢日正开话与实爱再华二城动比面高又或力应女种教车分像系长手次已明打太路起己相主关十间凤外呢觉使该友才进凰她民着各全将少两加回感式第球性老程把被公论及龙校别体重给听水做常您见里东风解湾月等啦部原美先音通管网区期错否乐入找书让四啊由选较数表内场它从快欢至立目社合望怎认告更几考度难版头喜许光今买算弟若统身记代号处完接计言字师并政玩张男谁山每结且星非建改连放哈活研直设陈报转党指五变气西试希神取化物王任林单世受近义死便反士战空队跟却北必业功写影声平员金讨色则容档片向妳市利兴白强安央特议办价总传思花元叫保份求究呵件未决组万竹级持笑投哪室曾走喔标流支独猫卡需兄门共语海口阿线马黄参般命视观联脑朋格儿八修料钱失吃住即另录专象换基板拿远速形孩备歌帮确候除界装类讲器南案画英诉带差乎量久掉似整引班迷图制费赛奇识型超边耶品舍虽始运李务权验故六读怪飞满服梦收眼造念留课军破精半约愿令底答演达雄深票早院够曲假谈术棒卖黑百胜推存火准示往碟易况晚离治导七段团调证列伤永刚排哥德九甚杀照软包怕条夜商概根供绝千客切集称据落越竟尽待闻园忘值产消双红座展育跑附嘛执唱技某硬斯云游息助须苦介效首质例唉职复输节规注毕查热油馆态停福救倒亲害乱古步宝击举终嗯印限依断轻环简趣志响随练续鱼篇司局送极角省源阳干习罗武免疑拉克仍楼佛足低广烦鸟显码土率圣坏初具预呀众责争兵智误境青顺野楚贵负压史适测怀迎配魔慢哇懂呜亦味评舞细医帝属句恋败宜杨甲追灌春左敢灵狂际群族木骑项戏遇狗佳博右痛营妹康善征历官尔按编病护补择抓石岁领寻温养止守君血田雨居谓异优跳拜烂封恶良模状浪聊增核激维陆吴牛忙词剧宿急啥抱静攻亚江致阵严宗警垒夫密睡午店势悲兰幕缘周厂签坐香爽控微登翻普蛮冷威毒俊络辑母创堂赵套旧杂述恐幸亮丽巴礼酒仁餐牌突脚剑招吉父仔典搞房素防授充草暴虑绍背刘委府景忆尤诸缺援漫琴骂纯尚艺惜置益姐诚继湖欲麻靠肉松刻纪退既含判释皮波承射堆莫键赶旁笔扁奏树律铁荣昨毛彩归虎罪皆叶售弹卫施铭刀块汉欣布赏载险播升钟寄弄付构啰磁萤伟荐洋嘿启梅策嘻灯鬼检宣哦妈均派猪济架享呆训蓝划担努郭歉纸贴暗呼罢巧慧穿详雷协督顾脸逢岛奖批略短幻沙';

const CATEGORY_DEFINITIONS = [
    { id: 'pronouns', label: 'Pronouns', chars: '我你他她它们您妳' },
    { id: 'particles', label: 'Particles', chars: '的了着过吗呢吧啊啦嘛呀么嗯哦喔嘿啰' },
    { id: 'numbers', label: 'Numbers', chars: '一二三四五六七八九十百千万两半第' },
    { id: 'actions', label: 'Actions', chars: '是有在来到去看听说问请想得出还对做见找让从认告买算完接玩改放活转指变取写走换拿帮讲掉引始运读收造留卖推往导调伤排杀照包供切待忘消跑执唱救倒击举送拉骑抓跳拜搞援骂退承射赶播升弄派划担穿' },
    { id: 'learning', label: 'Learning', chars: '学文题科教校书读写字词试考答研课术笔纸篇卷章' },
    { id: 'people', label: 'People', chars: '人子女男父母哥弟姐妹妹儿兄朋朋友师工农民商兵警察仔' },
    { id: 'body', label: 'Body', chars: '心手头身眼口脑脚血脸耳鼻牙舌肉皮毛' },
    { id: 'food', label: 'Food', chars: '饭吃喝肉酒餐米鱼牛猪茶菜果包糖蛋面' },
    { id: 'animals', label: 'Animals', chars: '龙凤凰猫狗鸟鱼牛马虎猪鸡熊象兔蛇猴蛙蜂' },
    { id: 'nature', label: 'Nature', chars: '天地水火风雨雪雷电光山海江河湖云阳月星木石土田花草树林竹' },
    { id: 'places', label: 'Places', chars: '国家城路站区场市院室门房店厂园街府局馆堂岛' },
    { id: 'time', label: 'Time', chars: '时日月年现在前后今早晚午昨春秋旧久刻' },
    { id: 'transport', label: 'Transport', chars: '车船飞机轮骑路站' },
    { id: 'tech', label: 'Tech & Media', chars: '资讯电机网线视脑码键屏标档碟录播' },
    { id: 'society', label: 'Society', chars: '国政党法军警社民官权议公队府兵' },
    { id: 'money', label: 'Money', chars: '钱价费买卖财资付' },
    { id: 'feelings', label: 'Feelings', chars: '爱喜欢感怕苦烦疑慢悲恐幸惜欲靠恨肯' },
    { id: 'colors', label: 'Colors', chars: '色白黑红青蓝绿黄彩' },
    { id: 'qualities', label: 'Qualities', chars: '大小好多少高强安美快难错乐清真新明重常原先近平低坏优静严密普冷俊亮丽纯善良急' },
    { id: 'measure', label: 'Measure Words', chars: '个位只次回面块件本些台份片条段团座颗' },
    { id: 'common-1', label: 'Common 1-200', rankMax: 200 },
    { id: 'common-2', label: 'Common 201-500', rankMax: 500 },
    { id: 'common-3', label: 'Common 501-1000', rankMax: 1000 }
];

const LEARNING_PATHWAY = [
    { id: 'all', label: 'Full Journey', shortLabel: 'All', from: 1, to: 1000 },
    { id: 'foundation', label: 'Starter Set', shortLabel: '1', from: 1, to: 100 },
    { id: 'core', label: 'Everyday Words', shortLabel: '2', from: 101, to: 250 },
    { id: 'daily', label: 'Reading Builder', shortLabel: '3', from: 251, to: 500 },
    { id: 'fluency', label: 'Story Reader', shortLabel: '4', from: 501, to: 750 },
    { id: 'expansion', label: 'Word Explorer', shortLabel: '5', from: 751, to: 1000 }
];

const legacyByChar = new Map(legacyCharacterDatabase.map((char) => [char.char, char]));
const pathwayById = new Map(LEARNING_PATHWAY.map((stage) => [stage.id, stage]));
const ENGLISH_OVERRIDES = {
    牙: { meaning: 'Tooth; teeth', example: 'Tooth' },
    舌: { meaning: 'Tongue', example: 'Tongue' },
    手: { meaning: 'Hand', example: 'Hand' },
    脚: { meaning: 'Foot; leg', example: 'Foot' },
    心: { meaning: 'Heart; mind', example: 'Heart' },
    肺: { meaning: 'Lung', example: 'Lung' },
    肝: { meaning: 'Liver', example: 'Liver' },
    胃: { meaning: 'Stomach', example: 'Stomach' },
    骨: { meaning: 'Bone', example: 'Bone' },
    血: { meaning: 'Blood', example: 'Blood' },
    家: { meaning: 'Home; family', example: 'Home' },
    房: { meaning: 'House; room', example: 'House' },
    门: { meaning: 'Door; gate', example: 'Door' },
    窗: { meaning: 'Window', example: 'Window' },
    墙: { meaning: 'Wall', example: 'Wall' },
    床: { meaning: 'Bed', example: 'Bed' },
    桌: { meaning: 'Table; desk', example: 'Table' },
    椅: { meaning: 'Chair', example: 'Chair' },
    灯: { meaning: 'Lamp; light', example: 'Lamp' },
    店: { meaning: 'Store; shop', example: 'Store' },
    公: { meaning: 'Public; fair', example: 'Public' },
    园: { meaning: 'Garden; park', example: 'Park' },
    医: { meaning: 'Medicine; doctor-related', example: 'Doctor' },
    院: { meaning: 'Hospital; courtyard; institute', example: 'Hospital' },
    工: { meaning: 'Work; worker; craft', example: 'Work' },
    厂: { meaning: 'Factory', example: 'Factory' },
    车: { meaning: 'Car; vehicle', example: 'Car' },
    船: { meaning: 'Boat; ship', example: 'Boat' },
    飞: { meaning: 'Fly; airplane-related', example: 'Airplane' },
    机: { meaning: 'Machine; airplane-related', example: 'Machine' },
    自: { meaning: 'Self; oneself', example: 'Self' },
    行: { meaning: 'Walk; go; line', example: 'Walk' },
    轮: { meaning: 'Wheel; turn', example: 'Wheel' },
    师: { meaning: 'Teacher; master', example: 'Teacher' },
    农: { meaning: 'Farmer; farming', example: 'Farmer' },
    民: { meaning: 'People; citizen', example: 'People' },
    商: { meaning: 'Business; merchant', example: 'Merchant' },
    兵: { meaning: 'Soldier', example: 'Soldier' },
    士: { meaning: 'Scholar; soldier; gentleman', example: 'Soldier' },
    警: { meaning: 'Police; warning', example: 'Police' },
    察: { meaning: 'Observe; inspect; police-related', example: 'Police' },
    空: { meaning: 'Empty; sky; air', example: 'Air' },
    司: { meaning: 'Manage; company-related', example: 'Driver' },
    厨: { meaning: 'Kitchen; cook', example: 'Cook' },
    种: { meaning: 'Kind; type; seed', example: 'Type' },
    里: { meaning: 'Inside; Chinese mile', example: 'Inside' },
    个: { meaning: 'Measure word for people or things', example: 'One item' },
    两: { meaning: 'Two; both', example: 'Two things' },
    只: { meaning: 'Measure word; only', example: 'One animal' },
    次: { meaning: 'Time; occurrence; order', example: 'One time' },
    回: { meaning: 'Return; time; reply', example: 'Return' },
    块: { meaning: 'Piece; chunk; block', example: 'One piece' },
    件: { meaning: 'Measure word for items', example: 'One item' },
    红: { meaning: 'Red', example: 'Red color' },
    绿: { meaning: 'Green', example: 'Green color' },
    蓝: { meaning: 'Blue', example: 'Blue color' },
    黄: { meaning: 'Yellow', example: 'Yellow color' },
    白: { meaning: 'White', example: 'White color' },
    黑: { meaning: 'Black', example: 'Black color' },
    灰: { meaning: 'Gray', example: 'Gray color' },
    紫: { meaning: 'Purple', example: 'Purple color' },
    橙: { meaning: 'Orange', example: 'Orange color' },
    粉: { meaning: 'Pink; powder', example: 'Pink color' }
};
const containsChinese = (text) => /[\u3400-\u9fff]/.test(text || '');

const characterDatabase = [...COMMON_1000_CHARS].map((char, index) => {
    const rank = index + 1;
    const legacy = legacyByChar.get(char);
    const category = resolveCategory(char, rank);
    const override = ENGLISH_OVERRIDES[char];
    const meaningText = override?.meaning || legacy?.meaning;
    const exampleText = override?.example || legacy?.example;

    return {
        char,
        rank,
        pinyin: legacy?.pinyin || '',
        strokes: legacy?.strokes || null,
        meaning: meaningText && !containsChinese(meaningText)
            ? meaningText
            : `${category.label} character, frequency rank #${rank}`,
        example: exampleText && !containsChinese(exampleText)
            ? exampleText
            : `Common Chinese character #${rank}`,
        category: category.id
    };
});

// ---- Chinese vocabulary: 组词 (words) + 造句 (sentence) ----
// Shared pools of real common words/sentences, matched by character, so most
// common characters get genuine Chinese (with a safe fallback for the rest).
const WORD_POOL = ['你好', '我们', '你们', '他们', '大家', '自己', '中国', '中文', '文化', '学生', '学习', '学校', '同学', '老师', '朋友', '大学', '上学', '时间', '现在', '今天', '明天', '昨天', '星期', '每天', '早上', '中午', '晚上', '上午', '下午', '喜欢', '谢谢', '客气', '对不起', '没关系', '知道', '觉得', '因为', '所以', '但是', '可是', '如果', '还是', '或者', '这里', '那里', '哪里', '这个', '那个', '哪个', '什么', '怎么', '为什么', '多少', '一些', '东西', '工作', '上班', '下班', '公司', '电话', '电脑', '电视', '电影', '手机', '网络', '上网', '音乐', '唱歌', '跳舞', '画画', '读书', '看书', '写字', '名字', '汉字', '说话', '普通话', '问题', '回答', '介绍', '帮助', '高兴', '快乐', '开心', '漂亮', '可爱', '聪明', '努力', '认真', '干净', '安静', '容易', '重要', '简单', '方便', '便宜', '健康', '身体', '头发', '眼睛', '鼻子', '嘴巴', '衣服', '鞋子', '颜色', '红色', '白色', '黑色', '蓝色', '绿色', '黄色', '天气', '下雨', '下雪', '刮风', '太阳', '月亮', '星星', '春天', '夏天', '秋天', '冬天', '国家', '北京', '城市', '地方', '房间', '房子', '飞机', '火车', '汽车', '自行车', '机场', '车站', '银行', '医院', '商店', '饭店', '公园', '图书馆', '教室', '宿舍', '厨房', '客厅', '米饭', '面条', '包子', '饺子', '鸡蛋', '牛奶', '面包', '苹果', '香蕉', '西瓜', '水果', '蔬菜', '咖啡', '啤酒', '早饭', '午饭', '晚饭', '吃饭', '喝水', '做饭', '父亲', '母亲', '爸爸', '妈妈', '哥哥', '姐姐', '弟弟', '妹妹', '儿子', '女儿', '孩子', '爷爷', '奶奶', '家人', '男人', '女人', '男孩', '女孩', '一起', '一定', '一样', '一点', '加油', '旅游', '旅行', '运动', '跑步', '游泳', '打球', '篮球', '足球', '睡觉', '起床', '洗手', '刷牙', '满意', '希望', '决定', '准备', '开始', '结束', '完成', '成功', '关系', '经济', '政府', '历史', '科学', '数学', '语文', '英语', '老板', '司机', '警察', '医生', '护士', '工人', '农民', '记者', '演员', '经理', '主席', '比赛', '节目', '新闻', '故事', '小说', '报纸', '杂志', '词典', '课本', '作业', '考试', '成绩', '分数', '题目', '答案', '练习', '复习', '上课', '下课', '世界', '生活', '工程', '建设', '发展', '社会', '人民', '问好', '回家', '出门'];

const SENTENCE_POOL = ['我是中国人。', '你好吗？', '我很好，谢谢你。', '今天天气很好。', '我喜欢学习中文。', '他是我的好朋友。', '我们一起去学校。', '这是我的老师。', '你叫什么名字？', '我每天都很忙。', '明天我要去北京。', '妈妈在家里做饭。', '我想喝一杯水。', '他正在看书。', '这本书很有意思。', '小猫在睡觉。', '请你帮我一下。', '我不知道这个字怎么写。', '今天是星期一。', '我爱我的家人。', '弟弟在画画。', '姐姐喜欢唱歌。', '爸爸去上班了。', '外面下雨了。', '天上有很多星星。', '我会写自己的名字。', '老师在教我们写字。', '这个问题很简单。', '我有一个问题。', '请大家安静。', '现在几点了？', '我饿了，想吃饭。', '这件衣服很漂亮。', '他跑得很快。', '我喜欢看电影。', '公园里有很多人。', '火车快要开了。', '我用电脑工作。', '孩子们在玩游戏。', '今天我很高兴。', '请你慢慢说。', '这是什么意思？', '我们坐车去吧。', '他的中文说得很好。', '太阳出来了。', '我想买一本书。', '学校离我家很近。', '他在听音乐。', '我们一起加油吧。', '妹妹喜欢吃苹果。', '春天来了，花开了。', '哥哥在打篮球。', '我每天都要喝牛奶。', '这个城市很大。', '我的朋友很多。', '老师说我写得很好。', '我们是好朋友。', '请问，洗手间在哪里？', '时间过得真快。', '我想去旅游。'];

function wordsFor(ch) {
    const hits = [];
    for (const w of WORD_POOL) {
        if (w.includes(ch)) { hits.push(w); if (hits.length >= 4) break; }
    }
    return hits.length ? hits : [ch];
}

function sentenceFor(ch) {
    return SENTENCE_POOL.find((s) => s.includes(ch)) || `这个字是「${ch}」。`;
}

function resolveCategory(char, rank) {
    const matchedCategory = CATEGORY_DEFINITIONS.find((category) => category.chars?.includes(char));
    if (matchedCategory) return matchedCategory;
    if (rank <= 200) return CATEGORY_DEFINITIONS.find((category) => category.id === 'common-1');
    if (rank <= 500) return CATEGORY_DEFINITIONS.find((category) => category.id === 'common-2');
    return CATEGORY_DEFINITIONS.find((category) => category.id === 'common-3');
}

let currentIndex = 0;
let filteredCharacters = [...characterDatabase];
let undoStack = [];
const STORAGE_KEY = 'han-learning-progress-v1';

// DOM 元素
const pathwayMenu = document.getElementById('pathwayMenu');
const sidebarSummary = document.getElementById('sidebarSummary');
const mainCharacter = document.getElementById('mainCharacter');
const pinyinDisplay = document.getElementById('pinyinDisplay');
const strokeCount = document.getElementById('strokeCount');
const wordsEl = document.getElementById('words');
const sentenceEl = document.getElementById('sentence');
const playSound = document.getElementById('playSound');
const practiceCanvas = document.getElementById('practiceCanvas');
const ctx = practiceCanvas.getContext('2d');
const brushColor = document.getElementById('brushColor');
const brushSize = document.getElementById('brushSize');
const sizeDisplay = document.getElementById('sizeDisplay');
const clearBtn = document.getElementById('clearBtn');
const undoBtn = document.getElementById('undoBtn');
const showHintBtn = document.getElementById('showHintBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const counter = document.getElementById('counter');
const orderStrokeCount = document.getElementById('orderStrokeCount');
const strokeOrderSteps = document.getElementById('strokeOrderSteps');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentPathway = 'foundation';
let strokeOrderRequestId = 0;
let savedProgress = loadProgress();

// 初始化
window.addEventListener('load', () => {
    resizeCanvas();
    applySavedProgress();
    renderPathwayMenu();
    filterCharacters(savedProgress?.currentChar);
    setupEventListeners();
});

window.addEventListener('resize', resizeCanvas);

// 设置画布大小
function resizeCanvas() {
    const rect = practiceCanvas.getBoundingClientRect();
    practiceCanvas.width = Math.max(1, Math.floor(rect.width));
    practiceCanvas.height = Math.max(1, Math.floor(rect.height));
}

function getCanvasPoint(e) {
    const rect = practiceCanvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) * (practiceCanvas.width / rect.width),
        y: (e.clientY - rect.top) * (practiceCanvas.height / rect.height)
    };
}

function loadProgress() {
    try {
        const rawProgress = localStorage.getItem(STORAGE_KEY);
        if (!rawProgress) return null;

        const progress = JSON.parse(rawProgress);
        if (progress?.version !== 1) return null;
        return progress;
    } catch {
        return null;
    }
}

function saveProgress() {
    const char = filteredCharacters[currentIndex];

    const positions = {
        ...(savedProgress?.positions || {})
    };
    const seen = {
        ...(savedProgress?.seen || {})
    };

    if (char) {
        positions[currentPathway] = char.char;
        seen[char.char] = Date.now();
    }

    savedProgress = {
        version: 1,
        currentPathway,
        currentChar: char?.char || savedProgress?.currentChar || null,
        brushColor: brushColor.value,
        brushSize: brushSize.value,
        positions,
        seen,
        updatedAt: Date.now()
    };

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedProgress));
    } catch {
        // Ignore storage failures so progress caching stays invisible to the user.
    }
}

function applySavedProgress() {
    if (!savedProgress) return;

    if (pathwayById.has(savedProgress.currentPathway)) {
        currentPathway = savedProgress.currentPathway;
    }

    if (savedProgress.brushColor) {
        brushColor.value = savedProgress.brushColor;
    }

    if (savedProgress.brushSize) {
        brushSize.value = savedProgress.brushSize;
        sizeDisplay.textContent = savedProgress.brushSize;
    }
}

// 渲染学习路径
function renderPathwayMenu() {
    pathwayMenu.innerHTML = '';

    LEARNING_PATHWAY.forEach((stage) => {
        const btn = document.createElement('button');
        btn.className = 'pathway-btn';
        btn.dataset.pathway = stage.id;
        const stageCount = stage.to - stage.from + 1;
        btn.innerHTML = `
            <span class="pathway-name">${stage.label}</span>
            <span class="pathway-range">${stageCount} chars</span>
        `;
        btn.addEventListener('click', () => {
            currentPathway = stage.id;
            filterCharacters(savedProgress?.positions?.[currentPathway]);
        });
        pathwayMenu.appendChild(btn);
    });

    updateActivePathway();
}

function updateActivePathway() {
    document.querySelectorAll('.pathway-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.pathway === currentPathway);
    });
}

function getPathwayCharacters() {
    const pathway = pathwayById.get(currentPathway);
    if (!pathway) return characterDatabase;

    return characterDatabase.filter((char) => char.rank >= pathway.from && char.rank <= pathway.to);
}

function getFilteredCharacters() {
    return getPathwayCharacters();
}

function updateSidebarSummary() {
    const pathway = pathwayById.get(currentPathway);
    sidebarSummary.textContent = `${filteredCharacters.length} characters · ${pathway?.label || 'Path'}`;
}

function updateActiveButton() {
    updateActivePathway();
}

// 显示汉字信息
function displayCharacter(index) {
    if (index < 0 || index >= filteredCharacters.length) {
        mainCharacter.textContent = '-';
        pinyinDisplay.textContent = 'No match';
        strokeCount.textContent = '-';
        wordsEl.textContent = '—';
        sentenceEl.textContent = '没有匹配的汉字。';
        orderStrokeCount.textContent = '-';
        strokeOrderSteps.innerHTML = '';
        clearCanvas();
        updateCounter();
        updateActiveButton();
        saveProgress();
        return;
    }
    
    currentIndex = index;
    const char = filteredCharacters[index];
    
    mainCharacter.textContent = char.char;
    pinyinDisplay.textContent = char.pinyin || `Rank #${char.rank}`;
    strokeCount.textContent = char.strokes || '...';
    wordsEl.textContent = wordsFor(char.char).join('、');
    sentenceEl.textContent = sentenceFor(char.char);
    renderStrokeOrder(char);
    
    clearCanvas();
    updateCounter();
    updateActiveButton();
    saveProgress();
}

// 渲染笔画顺序步骤
function renderStrokeOrder(char) {
    const requestId = ++strokeOrderRequestId;
    orderStrokeCount.textContent = char.strokes || '...';
    strokeOrderSteps.innerHTML = '';
    strokeOrderSteps.classList.add('loading');
    strokeOrderSteps.textContent = 'Loading stroke order...';

    if (!window.HanziWriter) {
        renderStrokeOrderFallback(char.strokes);
        return;
    }

    HanziWriter.loadCharacterData(char.char)
        .then((charData) => {
            if (requestId !== strokeOrderRequestId) return;
            char.strokes = charData.strokes.length;
            strokeCount.textContent = char.strokes;
            orderStrokeCount.textContent = char.strokes;
            renderStrokeOrderPaths(charData.strokes);
        })
        .catch(() => {
            if (requestId !== strokeOrderRequestId) return;
            renderStrokeOrderFallback(char.strokes);
        });
}

function renderStrokeOrderPaths(strokes) {
    strokeOrderSteps.classList.remove('loading');
    strokeOrderSteps.innerHTML = '';

    strokes.forEach((_, index) => {
        const step = document.createElement('div');
        step.className = 'stroke-order-step';
        step.setAttribute('aria-label', `Stroke ${index + 1}`);

        const number = document.createElement('span');
        number.className = 'stroke-order-number';
        number.textContent = index + 1;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 1024 1024');
        svg.setAttribute('aria-hidden', 'true');

        strokes.slice(0, index + 1).forEach((strokePath, strokeIndex) => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', strokePath);
            path.setAttribute('transform', 'translate(0, 900) scale(1, -1)');
            path.setAttribute('class', strokeIndex === index ? 'current-stroke' : 'previous-stroke');
            svg.appendChild(path);
        });

        step.appendChild(number);
        step.appendChild(svg);
        strokeOrderSteps.appendChild(step);
    });
}

function renderStrokeOrderFallback(strokes) {
    strokeOrderSteps.classList.remove('loading');
    strokeOrderSteps.innerHTML = '';

    if (!strokes) {
        strokeOrderSteps.textContent = 'Stroke data unavailable';
        return;
    }

    for (let index = 1; index <= strokes; index++) {
        const step = document.createElement('div');
        step.className = 'stroke-order-step fallback';
        step.textContent = index;
        strokeOrderSteps.appendChild(step);
    }
}

// 更新计数器
function updateCounter() {
    counter.textContent = filteredCharacters.length > 0 ? `${currentIndex + 1} / ${filteredCharacters.length}` : '0 / 0';
    updateSidebarSummary();
}

// 设置事件监听
function setupEventListeners() {
    // Pronunciation Button
    playSound.addEventListener('click', () => {
        const char = filteredCharacters[currentIndex];
        if (char) speak(char.char);
    });

    // 组词 / 造句 pronunciation
    document.querySelectorAll('.mini-play').forEach((btn) => {
        btn.addEventListener('click', () => {
            const el = document.getElementById(btn.dataset.target);
            const text = el && el.textContent.trim();
            if (text && text !== '—') speak(text);
        });
    });

    // Brush Size
    brushSize.addEventListener('input', (e) => {
        sizeDisplay.textContent = e.target.value;
        saveProgress();
    });

    brushColor.addEventListener('input', saveProgress);

    // Clear Button
    clearBtn.addEventListener('click', clearCanvas);

    // Undo Button
    undoBtn.addEventListener('click', undo);

    // Hint Button
    showHintBtn.addEventListener('click', showHint);

    // 导航按钮
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) displayCharacter(currentIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < filteredCharacters.length - 1) {
            displayCharacter(currentIndex + 1);
        }
    });

    // 画布事件
    practiceCanvas.addEventListener('mousedown', startDrawing);
    practiceCanvas.addEventListener('mousemove', draw);
    practiceCanvas.addEventListener('mouseup', stopDrawing);
    practiceCanvas.addEventListener('mouseleave', stopDrawing);

    // 触摸事件
    practiceCanvas.addEventListener('touchstart', handleTouchStart);
    practiceCanvas.addEventListener('touchmove', handleTouchMove);
    practiceCanvas.addEventListener('touchend', stopDrawing);
}

// 过滤汉字
function filterCharacters(preferredChar = null) {
    filteredCharacters = getFilteredCharacters();
    
    const preferredIndex = preferredChar
        ? filteredCharacters.findIndex((char) => char.char === preferredChar)
        : -1;
    displayCharacter(preferredIndex >= 0 ? preferredIndex : 0);
}

// ---- Pronunciation (made robust for iPad / iOS Safari) ----
let cachedVoices = [];
let speechPrimed = false;

function refreshVoices() {
    if ('speechSynthesis' in window) cachedVoices = window.speechSynthesis.getVoices() || [];
}
if ('speechSynthesis' in window) {
    refreshVoices();
    // voices load asynchronously on iOS — keep them up to date
    window.speechSynthesis.addEventListener('voiceschanged', refreshVoices);
}

// pick a Chinese voice; without one iOS reads a Chinese char with an English
// voice and stays silent
function pickZhVoice() {
    if (!cachedVoices.length) refreshVoices();
    return cachedVoices.find((v) => /^zh/i.test(v.lang))
        || cachedVoices.find((v) => /(chinese|mandarin|中文|普通话|国语|粤)/i.test(v.name))
        || null;
}

// iOS only produces audible speech after a genuine user gesture — prime it on
// the very first tap anywhere so the first "Pronounce" is heard.
function primeSpeech() {
    if (speechPrimed || !('speechSynthesis' in window)) return;
    try {
        const u = new SpeechSynthesisUtterance(' ');
        u.volume = 0;
        window.speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
    speechPrimed = true;
}
document.addEventListener('pointerdown', primeSpeech, { once: true });
document.addEventListener('touchend', primeSpeech, { once: true });

// 发音功能
function speak(character) {
    if (!('speechSynthesis' in window)) {
        alert('Sorry, this browser does not support speech.');
        return;
    }
    const synth = window.speechSynthesis;
    if (synth.speaking || synth.pending) synth.cancel(); // clear a stuck queue

    const utterance = new SpeechSynthesisUtterance(character);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.8;
    const voice = pickZhVoice();
    if (voice) utterance.voice = voice;

    synth.speak(utterance);
    if (synth.paused) synth.resume(); // iOS can start paused

    // 按钮反馈
    playSound.style.transform = 'scale(0.95)';
    setTimeout(() => {
        playSound.style.transform = 'scale(1)';
    }, 100);
}

// 绘画函数
function startDrawing(e) {
    isDrawing = true;
    saveCanvasState();
    const point = getCanvasPoint(e);
    lastX = point.x;
    lastY = point.y;
}

function draw(e) {
    if (!isDrawing) return;

    const point = getCanvasPoint(e);
    const currentX = point.x;
    const currentY = point.y;

    ctx.strokeStyle = brushColor.value;
    ctx.lineWidth = brushSize.value;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    lastX = currentX;
    lastY = currentY;
}

function stopDrawing() {
    isDrawing = false;
}

// 触摸事件处理
function handleTouchStart(e) {
    e.preventDefault();
    isDrawing = true;
    saveCanvasState();
    const touch = e.touches[0];
    const point = getCanvasPoint(touch);
    lastX = point.x;
    lastY = point.y;
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!isDrawing) return;

    const touch = e.touches[0];
    const point = getCanvasPoint(touch);
    const currentX = point.x;
    const currentY = point.y;

    ctx.strokeStyle = brushColor.value;
    ctx.lineWidth = brushSize.value;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    lastX = currentX;
    lastY = currentY;
}

// 画布状态管理
function saveCanvasState() {
    undoStack.push(ctx.getImageData(0, 0, practiceCanvas.width, practiceCanvas.height));
    if (undoStack.length > 10) undoStack.shift(); // 限制撤销步数
}

function undo() {
    if (undoStack.length > 0) {
        const imageData = undoStack.pop();
        ctx.putImageData(imageData, 0, 0);
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, practiceCanvas.width, practiceCanvas.height);
    undoStack = [];
}

// 显示提示
function showHint() {
    ctx.clearRect(0, 0, practiceCanvas.width, practiceCanvas.height);
    
    // 用透明灰色显示汉字作为提示
    ctx.globalAlpha = 0.2;
    ctx.font = `bold ${Math.min(practiceCanvas.width, practiceCanvas.height) * 0.8}px 'Microsoft YaHei', 'SimHei'`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
        filteredCharacters[currentIndex].char,
        practiceCanvas.width / 2,
        practiceCanvas.height / 2
    );
    ctx.globalAlpha = 1.0;
}
