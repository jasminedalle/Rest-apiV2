exports.config = {
  name: 'animequotes',
  author: 'Clarence',
  description: 'Fetches a random anime quotes from the anime data',
  method: 'get',
  category: 'anime',
  link: ['/animequotes']
};

exports.initialize = async function ({ req, res }) {
const animeQuotes = [
{
  character: `Naruto Uzumaki`, 
  quote: `I’m not gonna run away, I never go back on my word! That’s my nindo: my ninja way!`
},
{
  character: `Monkey D. Luffy`, 
  quote: `I don’t want to conquer anything. I just think the guy with the most freedom in this whole ocean... is the King of the Pirates!`
},
{
  character: `Eren Yeager`, 
  quote: `If you win, you live. If you lose, you die. If you don’t fight, you can’t win!`
},
{
  character: `All Might`, 
  quote: `When you have to save someone, you don’t think about what happens next. You just do it.`
},
{
  character: `Edward Elric`, 
  quote: `A lesson without pain is meaningless. For you will never gain without sacrificing something else.`
},
{
  character: `Light Yagami`, 
  quote: `I am Justice! I protect the innocent and those who fear evil. I am the one who will become the god of a new world!`
},
{
  character: `Kirito`, 
  quote: `I’d rather trust and regret than doubt and regret.`
},
{
  character: `Saitama`, 
  quote: `I’m just a guy who’s a hero for fun.`
},
{
  character: `Okabe Rintarou`, 
  quote: `The universe has a beginning, but it has no end. Eternity is a long time.`
},
{
  character: `Tanjiro Kamado`, 
  quote: `No matter how many times I fall, I will always get back up.`
},
{
  character: `Lelouch Lamperouge`, 
  quote: `If the king doesn’t lead, then how can he expect his subordinates to follow?`
},
{
  character: `Gon Freecss`, 
  quote: `You can’t just sit around waiting for someone to come to your rescue.`
},
{
  character: `Mitsuha Miyamizu`, 
  quote: `I can't remember you. I can't remember your name. But I know I want to see you again.`
},
{
  character: `Natsu Dragneel`, 
  quote: `I don’t care what happens. I will not lose, not to anyone!`
},
{
  character: `Shinji Ikari`, 
  quote: `I mustn't run away.`
},
{
  character: `Ken Kaneki`, 
  quote: `It's not the world that's messed up. It's those of us in it.`
},
{
  character: `Yato`, 
  quote: `I want to be a God who is worshiped. I want to be a God who is loved.`
},
{
  character: `Shoyo Hinata`, 
  quote: `The future belongs to those who believe in the beauty of their dreams.`
},
{
  character: `Ichigo Kurosaki`, 
  quote: `I’m not a hero. I’m just a guy who helps people.`
},
{
  character: `Gintoki Sakata`, 
  quote: `The reason why I can’t do anything is because I’m not doing anything.`
},
{
  character: `Maka Albarn`, 
  quote: `A true weapon is one that can protect others.`
},
{
  character: `Kaguya Shinomiya`, 
  quote: `Love is war; you have to be cunning.`
},
{
  character: `Shigeo Kageyama (Mob)`, 
  quote: `I just want to be a normal person.`
},
{
  character: `Subaru Natsuki`, 
  quote: `I don’t need to be a hero. I just want to save the girl I love.`
},
{
  character: `Emma`, 
  quote: `We’ll find a way to save everyone, no matter what it takes.`
},
{
  character: `Thorfinn`, 
  quote: `I'll kill you for the sake of my father.`
},
{
  character: `Tohru Honda`, 
  quote: `The world is not kind to those who are weak.`
},
{
  character: `Otonashi Yuzuru`, 
  quote: `It's not about how long you live, but how well you live.`
},
{
  character: `Asta`, 
  quote: `I will never give up! I will always keep on fighting!`
},
{
  character: `Ryuuji Takasu`, 
  quote: `No one is perfect, but we can be perfect for each other.`
},
{
  character: `Hyakkimaru`, 
  quote: `You don’t need a reason to fight. You just have to know what you’re fighting for.`
},
{
  character: `Nana Osaki`, 
  quote: `Dreams are only dreams if you don’t pursue them.`
},
{
  character: `Rei Kiriyama`, 
  quote: `Even if I’m alone, I’ll never stop moving forward.`
},
{
  character: `Kousei Arima`, 
  quote: `Music means everything to me, and that’s why it hurts so much.`
},
{
  character: `Dr. Kenzo Tenma`, 
  quote: `If you want to understand something, you have to get close to it.`
},
{
  character: `Sakurajima Mai`, 
  quote: `You can’t escape yourself.`
},
{
  character: `Shu Ouma`, 
  quote: `I want to be someone who can help others.`
},
{
  character: `Kazuma Satou`, 
  quote: `I’d rather choose to live in a fantasy world than in reality.`
},
{
  character: `Jyugo`, 
  quote: `Life is a game, so play it as you wish.`
},
{
  character: `Caiman`, 
  quote: `I don’t care about the past. I just want to eat.`
},
{
  character: `Chise Hatori`, 
  quote: `I want to be a part of the world, even if I am different.`
},
{
  character: `Victor Nikiforov`, 
  quote: `You can’t change your destiny. But you can change the way you face it.`
},
{
  character: `Shirou Emiya`, 
  quote: `I don’t want to regret anything. That’s why I fight.`
},
{
  character: `Meliodas`, 
  quote: `You can’t take on the world alone; you need friends.`
},
{
  character: `Akame`, 
  quote: `We fight for what we believe in. We fight for our own lives.`
},
{
  character: `Rin Okumura`, 
  quote: `I will not run away from my destiny.`
},
{
  character: `Mikasa Ackerman`, 
  quote: `I don’t want to lose anyone else.`
},
{
  character: `Sawako Kuronuma`, 
  quote: `I want to reach out. I want to touch the hearts of others.`
},
{
  character: `Toriko`, 
  quote: `The world is full of delicious things. I want to taste them all!`
},
{
  character: `Tsukiko Sagi`, 
  quote: `Sometimes it’s easier to just run away.`
},
{
  character: `Shouya Ishida`, 
  quote: `It’s fine to be a coward. It’s fine to be weak. Just don’t give up.`
},
{
  character: `Yui Hirasawa`, 
  quote: `Music is the voice of our feelings.`
},
{
  character: `Yui`, 
  quote: `Even if you’re gone, I’ll still carry you in my heart.`
},
{
  character: `Inori Yuzuriha`, 
  quote: `I want to live for the sake of others.`
},
{
  character: `Enju Aihara`, 
  quote: `I want to protect the people I love.`
},
{
  character: `Megumin`, 
  quote: `Explosions are the best magic!`
},
{
  character: `Tatsuya Shiba`, 
  quote: `I will not let my past define me.`
},
{
  character: `Ronja`, 
  quote: `I will forge my own path.`
},
{
  character: `Riko`, 
  quote: `I want to see what’s at the bottom of the Abyss.`
},
{
  character: `Decim`, 
  quote: `What does it mean to live? What does it mean to die?`
},
{
  character: `Keima Katsuragi`, 
  quote: `I’m not a hero; I’m just a player.`
},
{
  character: `Ryouta Sakamoto`, 
  quote: `In this world, only the strong survive.`
},
{
  character: `Sora`, 
  quote: `In this world, the only rule is to win.`
},
{
  character: `Ikoma`, 
  quote: `I refuse to accept a world where I can’t protect my friends.`
},
{
  character: `Oreki Houtarou`, 
  quote: `I’m not that interested in things, but I’ll help if it’s interesting.`
},
{
  character: `Ren`, 
  quote: `To grow up, you have to accept that you will never be the same.`
},
{
  character: `Watashi`, 
  quote: `The past is never really gone. It’s always with you.`
},
{
  character: `Jintan`, 
  quote: `We can’t forget about her, but we have to move on.`
},
{
  character: `Kyon`, 
  quote: `The world is full of mysteries, but it’s up to us to solve them.`
},
{
  character: `Sakura Minamoto`, 
  quote: `Even in death, I will not give up on my dreams!`
},
{
  character: `Naofumi Iwatani`, 
  quote: `I’ll take on the world if it means protecting the people I care about.`
},
{
  character: `Mahmut`, 
  quote: `A true leader fights for his people.`
},
{
  character: `Shichika Yasuri`, 
  quote: `I will not run away from my destiny.`
},
{
  character: `Aladdin`, 
  quote: `I want to see the world and all its wonders.`
},
{
  character: `Dororo`, 
  quote: `Life is about finding your own path.`
},
{
  character: `Taki`, 
  quote: `Time is not linear; it’s a cycle.`
},
{
  character: `Sōta Mizushino`, 
  quote: `The stories we create have the power to change reality.`
},
{
  character: `Aisaka Taiga`, 
  quote: `I’m not a doll. I’m a person!`
},
{
  character: `Haruhi Fujioka`, 
  quote: `It’s not about how much money you have; it’s about how you treat people.`
},
{
  character: `Bloop`, 
  quote: `Love can transcend death.`
},
{
  character: `Saiki Kusuo`, 
  quote: `I’d rather live a normal life than deal with all this supernatural nonsense.`
},
{
  character: `Hikigaya Hachiman`, 
  quote: `It's not about being a hero; it's about being honest with yourself.`
},
{
  character: `Mikado Ryuugamine`, 
  quote: `Sometimes, the hardest battles are the ones within ourselves.`
},
{
  character: `Yato`, 
  quote: `To be a god is to be loved.`
},
{
  character: `Hachiman Hikigaya`, 
  quote: `I don’t want to be a hero; I just want to help people in my own way.`
},
{
  character: `Kaguya Shinomiya`, 
  quote: `In love, the one who confesses first is the one who loses.`
},
{
  character: `Shouyou Hinata`, 
  quote: `I may be small, but I’ll never give up!`
},
{
  character: `Yuki Nagato`, 
  quote: `The world is full of things that can’t be understood.`
},
{
  character: `Lelouch vi Britannia`, 
  quote: `The only ones who should kill are those who are prepared to be killed.`
},
{
  character: `Roronoa Zoro`, 
  quote: `Nothing happened, but I will never forget this day!`
},
{
  character: `Aizawa Shouta`, 
  quote: `Heroes don’t need a reason to save someone. They just do it.`
},
{
  character: `Hinata Shoyo`, 
  quote: `I’ll become a player who can do anything!`
},
{
  character: `Nora`, 
  quote: `In a world full of chaos, you have to find your own place.`
}, 
{
  character: `Monkey D. Luffy`, 
  quote: `I don’t want to conquer anything. I just think the guy with the most freedom in this whole ocean... is the King of the Pirates!`
},
{
  character: `Eren Yeager`, 
  quote: `If you win, you live. If you lose, you die. If you don’t fight, you can't win!`
},
{
  character: `Edward Elric`, 
  quote: `A lesson without pain is meaningless. For you will never gain without sacrificing something else.`
},
{
  character: `Light Yagami`, 
  quote: `I am Justice! I protect the innocent and those who fear evil. I am the one who will become the god of a new world!`
},
{
  character: `Kirito`, 
  quote: `I'd rather trust and regret than doubt and regret.`
},
{
  character: `Saitama`, 
  quote: `I’m just a guy who’s a hero for fun.`
},
{
  character: `Gon Freecss`, 
  quote: `I will keep moving forward until I am the strongest!`
},
{
  character: `Natsu Dragneel`, 
  quote: `You don’t die for your friends; you live for them!`
},
{
  character: `Mikasa Ackerman`, 
  quote: `If we’re going to die anyway, then let’s die fighting!`
},
{
  character: `Yato`, 
  quote: `I want to be a god who is worshiped!`
},
{
  character: `Thorfinn`, 
  quote: `I’ll kill you for the sake of my father!`
},
{
  character: `Shinra Kusakabe`, 
  quote: `I'm going to be a hero who can save everyone!`
},
{
  character: `Rei Ayanami`, 
  quote: `I am myself, and that’s enough.`
},
{
  character: `Gintoki Sakata`, 
  quote: `The world is full of things that can’t be explained.`
},
{
  character: `Hachiman Hikigaya`, 
  quote: `It's easier to just give up than to keep trying.`
},
{
  character: `Lelouch Lamperouge`, 
  quote: `Sometimes, the best way to win is to lose.`
},
{
  character: `Tanjiro Kamado`, 
  quote: `No matter how many times I fall, I will always get back up!`
},
{
  character: `Shoyo Hinata`, 
  quote: `The future belongs to those who believe in the beauty of their dreams.`
},
{
  character: `Kenshin Himura`, 
  quote: `I will never kill again.`
},
{
  character: `Nana Osaki`, 
  quote: `We all have our own reasons to keep moving forward.`
},
{
  character: `Roronoa Zoro`, 
  quote: `Nothing happened, but I will never forget this day!`
},
{
  character: `Maka Albarn`, 
  quote: `A true weapon is one that can protect others.`
},
{
  character: `Shinichi Chiaki`, 
  quote: `If you can't do it, then you have to figure out a way to do it.`
},
{
  character: `Sora`, 
  quote: `In this world, the only rule is to win.`
},
{
  character: `Ichigo Kurosaki`, 
  quote: `I’m not a hero. I just do what I can!`
},
{
  character: `Onizuka Eikichi`, 
  quote: `If you’re going to be a delinquent, be the best one!`
},
{
  character: `Otonashi Yuzuru`, 
  quote: `It's not about how you die, but how you live.`
},
{
  character: `Kaguya Shinomiya`, 
  quote: `Love is war; you have to be cunning.`
},
{
  character: `Rintarou Okabe`, 
  quote: `The universe has a beginning, but it has no end.`
},
{
  character: `Mikasa Ackerman`, 
  quote: `The lesson I learned is that you have to protect what is important to you.`
},
{
  character: `Kousei Arima`, 
  quote: `Music means everything to me.`
},
{
  character: `Koro Sensei`, 
  quote: `To be a great teacher, you first need to be a great student.`
},
{
  character: `Luna`, 
  quote: `Friendship is more important than anything else.`
},
{
  character: `Gajeel Redfox`, 
  quote: `I’ll do whatever it takes to protect my friends!`
},
{
  character: `Saitama`, 
  quote: `I’m going to be the strongest man in the universe!`
},
{
  character: `Asta`, 
  quote: `I don’t have any magic, but I won't give up!`
},
{
  character: `Edward Elric`, 
  quote: `A lesson without pain is meaningless.`
},
{
  character: `Akame`, 
  quote: `We fight for what we believe in.`
},
{
  character: `Shouya Ishida`, 
  quote: `It’s fine to be a coward. Just don’t give up.`
},
{
  character: `Yuki Nagato`, 
  quote: `The past is never really gone; it’s always with you.`
},
{
  character: `Kamina`, 
  quote: `Don't believe in the you that believes in me. Believe in the you that believes in yourself!`
},
{
  character: `Gon Freecss`, 
  quote: `I’ll never give up; I’ll keep climbing!`
},
{
  character: `Haruhi Fujioka`, 
  quote: `You can’t put a price on friendship!`
},
{
  character: `Ryuuji Takasu`, 
  quote: `You have to be honest with yourself.`
},
{
  character: `Victor Nikiforov`, 
  quote: `You can’t change your destiny, but you can change the way you face it.`
},
{
  character: `Shinra Kusakabe`, 
  quote: `I want to become a hero!`
},
{
  character: `Erza Scarlet`, 
  quote: `We can’t give up on our friends!`
},
{
  character: `Luffy`, 
  quote: `I’ll never stop fighting for my dreams!`
},
{
  character: `Mitsuha Miyamizu`, 
  quote: `I can’t remember you, but I want to see you again!`
},
{
  character: `Hachiman Hikigaya`, 
  quote: `It’s not about being a hero; it's about being honest with yourself.`
},
{
  character: `Ryuko Matoi`, 
  quote: `I’m not going to lose to anyone!`
},
{
  character: `Subaru Natsuki`, 
  quote: `I refuse to accept a world where I can’t protect my friends!`
},
{
  character: `Mob`, 
  quote: `I’m just trying to be myself.`
},
{
  character: `Chika Fujiwara`, 
  quote: `Sometimes you just have to take a leap of faith.`
},
{
  character: `Tanjiro Kamado`, 
  quote: `The bond between us cannot be severed!`
},
{
  character: `Shinichi Chiaki`, 
  quote: `Life is a series of challenges; embrace them!`
},
{
  character: `Inuyasha`, 
  quote: `I’ll protect Kagome, no matter what!`
},
{
  character: `Nana`, 
  quote: `In the end, love is what matters.`
},
{
  character: `Kagome Higurashi`, 
  quote: `I won’t let you fight alone.`
},
{
  character: `Mamoru Chiba`, 
  quote: `I will protect the peace of this city!`
},
{
  character: `Shinobu Kocho`, 
  quote: `I’ll show you the power of shinobi!`
},
{
  character: `Hachiman`, 
  quote: `I’ll just do what I want.`
},
{
  character: `Matoi Ryuko`, 
  quote: `I don’t care about my past; I care about my future!`
},
{
  character: `Mikasa Ackerman`, 
  quote: `Don't let go of your humanity.`
},
{
  character: `Kenshin Himura`, 
  quote: `I will protect the weak!`
},
{
  character: `Yato`, 
  quote: `I’m just a god who wants to be loved.`
},
{
  character: `Megumi Fushiguro`, 
  quote: `I won’t let you down!`
},
{
  character: `Kazuma Satou`, 
  quote: `I’d rather be a loser than someone who gives up!`
},
{
  character: `Mikasa Ackerman`, 
  quote: `I will fight to the end for my family!`
},
{
  character: `Kirito`, 
  quote: `I will protect those who are important to me!`
},
{
  character: `Subaru Natsuki`, 
  quote: `No matter how many times I have to suffer, I will save you!`
},
{
  character: `Faye Valentine`, 
  quote: `Life is too short to regret. Just live it!`
},
{
  character: `Kazuki Takahashi`, 
  quote: `Believe in your cards and you’ll win!`
},
{
  character: `Rintarou Okabe`, 
  quote: `The future is not set in stone!`
},
{
  character: `Matoi Ryuko`, 
  quote: `I will fight for those I care about!`
},
{
  character: `Yukino Yukinoshita`, 
  quote: `I’m not perfect, but I’ll always be real.`
},
{
  character: `Akira Fudo`, 
  quote: `I will fight against evil, no matter the cost!`
},
{
  character: `Yoruichi Shihouin`, 
  quote: `You can’t give up; that’s the first step to losing!`
},
{
  character: `Lelouch vi Britannia`, 
  quote: `I will change the world with my own hands!`
},
{
  character: `Erza Scarlet`, 
  quote: `We are stronger together than we are apart!`
},
{
  character: `Hisoka`, 
  quote: `I live for the thrill of the hunt!`
},
{
  character: `Mikasa Ackerman`, 
  quote: `No matter how hard it gets, I will keep fighting!`
},
{
  character: `Shouyou Hinata`, 
  quote: `Even if I fall, I will get back up!`
},
{
  character: `Kamina`, 
  quote: `Believe in yourself, and you can achieve anything!`
},
{
  character: `Kazuki Muto`, 
  quote: `I will find my way to the top!`
},
{
  character: `Luffy`, 
  quote: `I will never back down from a fight!`
}
];
const randomIndex = Math.floor(Math.random() * animeQuotes.length);
const randomQuote = animeQuotes[randomIndex];
res.json(randomQuote);
};
