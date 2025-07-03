export interface ReadingData {
  id: number
  pericope: string
  text: string
  categories: string[]
  language: string
  introduction?: string
  conclusion?: string
  lectionary_id?: string
}

export const readingsData: ReadingData[] = [
  {
    id: 1,
    pericope: 'Matthew 5:1-12a',
    text: 'When Jesus saw the crowds, he went up the mountain, and after he had sat down, his disciples came to him. He began to teach them, saying: Blessed are the poor in spirit, for theirs is the Kingdom of heaven. Blessed are they who mourn, for they will be comforted. Blessed are the meek, for they will inherit the land. Blessed are they who hunger and thirst for righteousness, for they will be satisfied. Blessed are the merciful, for they will be shown mercy. Blessed are the clean of heart, for they will see God. Blessed are the peacemakers, for they will be called children of God. Blessed are they who are persecuted for the sake of righteousness, for theirs is the Kingdom of heaven. Blessed are you when they insult you and persecute you and utter every kind of evil against you falsely because of me. Rejoice and be glad, for your reward will be great in heaven.',
    categories: ['Funeral', 'Gospel'],
    language: 'English',
    introduction: 'A reading from the holy Gospel according to Matthew',
    conclusion: 'The Gospel of the Lord.'
  },
  {
    id: 2,
    pericope: 'Matthew 11:25-30',
    text: 'At that time Jesus answered; I give praise to you, Father, Lord of heaven and earth, for although you have hidden these things from the wise and the learned you have revealed them to the childlike. Yes, Father, such has been your gracious will. All things have been handed over to me by my Father. No one knows the Son except the Father, and no one knows the Father except the Son and anyone to whom the Son wishes to reveal him. Come to me, all you who labor and are burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am meek and humble of heart; and you will find rest for yourselves. For my yoke is easy, and my burden light.',
    categories: ['Funeral', 'Gospel'],
    language: 'English',
    introduction: 'A reading from the holy Gospel according to Matthew',
    conclusion: 'The Gospel of the Lord.'
  },
  {
    id: 3,
    pericope: 'Matthew 25:1-13',
    text: 'Jesus told his disciples this parable: The Kingdom of heaven will be like ten virgins who took their lamps and went out to meet the bridegroom. Five of them were foolish and five were wise. The foolish ones, when taking their lamps, brought no oil with them, but the wise brought flasks of oil with their lamps. Since the bridegroom was long delayed, they all became drowsy and fell asleep. At midnight, there was a cry, Behold, the bridegroom! Come out to meet him! Then all those virgins got up and trimmed their lamps. The foolish ones said to the wise, Give us some of your oil, for our lamps are going out. But the wise ones replied, No, for there may not be enough for us and you. Go instead to the merchants and buy some for yourselves. While they went off to buy it, the bridegroom came and those who were ready went to the wedding feast with him. Then the door was locked. Afterwards the other virgins came and said, Lord, Lord, open the door for us! But he said in reply, Amen, I say to you, I do not know you. Therefore, stay awake, for you know neither the day nor the hour.',
    categories: ['Funeral', 'Gospel'],
    language: 'English',
    introduction: 'A reading from the holy Gospel according to Matthew',
    conclusion: 'The Gospel of the Lord.'
  },
  {
    id: 4,
    pericope: 'Matthew 25:31-46',
    text: 'Jesus said to his disciples: When the Son of Man comes in his glory, and all the angels with him, he will sit upon his glorious throne, and all the nations will be assembled before him. And he will separate them one from another, as a shepherd separates the sheep from the goats. He will place the sheep on his right and the goats on his left. Then the king will say to those on his right, Come, you who are blessed by my Father. Inherit the kingdom prepared for you from the foundation of the world. For I was hungry and you gave me food. I was thirsty and you gave me drink, a stranger and you welcomed me, naked and you clothed me, ill and you cared for me, in prison and you visited me. Then the righteous will answer him and say, Lord, when did we see you hungry and feed you, or thirsty and give you drink? When did we see you a stranger and welcome you, or naked and clothe you? When did we see you ill or in prison, and visit you? And the king will say to them in reply, Amen, I say to you, whatever you did for one of these least brothers of mine, you did for me. Then he will say to those on his left, Depart from me, you accursed, into the eternal fire prepared for the Devil and his angels. For I was hungry and you gave me no food, I was thirsty and you gave me no drink, a stranger and you gave me no welcome, naked and you gave me no clothing, ill and in prison, and you did not care for me. Then they will answer and say, Lord, when did we see you hungry or thirsty or a stranger or naked or ill or in prison, and not minister to your needs? He will answer them, Amen, I say to you, what you did not do for one of these least ones, you did not do for me. And these will go off to eternal punishment, but the righteous to eternal life.',
    categories: ['Funeral', 'Gospel'],
    language: 'English',
    introduction: 'A reading from the holy Gospel according to Matthew',
    conclusion: 'The Gospel of the Lord.'
  },
  {
    id: 5,
    pericope: 'Mark 15:33-39;16:1-6',
    text: 'At noon darkness came over the whole land until three in the afternoon. And at three oclock Jesus cried out in a loud voice, Eloi, Eloi, lema sabachthani? which is translated, My God, my God, why have you forsaken me? Some of the bystanders who heard it said, Look, he is calling Elijah. One of them ran, soaked a sponge with wine, put it on a reed, and gave it to him to drink, saying, Wait, let us see if Elijah comes to take him down. Jesus gave a loud cry and breathed his last. The veil of the sanctuary was torn in two from top to bottom. When the centurion who stood facing him saw how he breathed his last he said, Truly this man was the Son of God! When the Sabbath was over, Mary Magdalene, Mary, the mother of James, and Salome bought spices so that they might go and anoint him. Very early when the sun had risen, on the first day of the week, they came to the tomb. They were saying to one another, Who will roll back the stone for us from the entrance to the tomb? When they looked up, they saw that the stone had been rolled back; it was very large. On entering the tomb they saw a young man sitting on the right side, clothed in a white robe, and they were utterly amazed. He said to them, Do not be amazed! You seek Jesus of Nazareth, the crucified. He has been raised; he is not here. Behold the place where they laid him.',
    categories: ['Funeral', 'Gospel'],
    language: 'English',
    introduction: 'A reading from the holy Gospel according to Mark',
    conclusion: 'The Gospel of the Lord.'
  },
  {
    id: 6,
    pericope: 'Luke 7:11-17',
    text: 'Jesus journeyed to a city called Nain, and his disciples and a large crowd accompanied him. As he drew near to the gate of the city, a man who had died was being carried out, the only son of his mother, and she was a widow. A large crowd from the city was with her. When the Lord saw her, he was moved with pity for her and said to her, Do not weep. He stepped forward and touched the coffin; at this the bearers halted, and he said, Young man, I tell you, arise! The dead man sat up and began to speak, and Jesus gave him to his mother. Fear seized them all, and they glorified God, exclaiming, A great prophet has arisen in our midst, and God has visited his people. This report about him spread through the whole of Judea and in all the surrounding region.',
    categories: ['Funeral', 'Gospel'],
    language: 'English',
    introduction: 'A reading from the holy Gospel according to Luke',
    conclusion: 'The Gospel of the Lord.'
  },
  {
    id: 7,
    pericope: 'Luke 12:35-40',
    text: 'Jesus said to his disciples: Gird your loins and light your lamps and be like servants who await their master return from a wedding, ready to open immediately when he comes and knocks. Blessed are those servants whom the master finds vigilant on his arrival. Amen, I say to you, he will gird himself, have them recline at table, and proceed to wait on them. And should he come in the second or third watch and find them prepared in this way, blessed are those servants. Be sure of this: if the master of the house had known the hour when the thief was coming, he would not have let his house be broken into. You also must be prepared, for at an hour you do not expect, the Son of Man will come.',
    categories: ['Funeral', 'Gospel'],
    language: 'English',
    introduction: 'A reading from the holy Gospel according to Luke',
    conclusion: 'The Gospel of the Lord.'
  },
  {
    id: 8,
    pericope: 'Luke 23:33,39-43',
    text: 'When the soldiers came to the place called the Skull, they crucified Jesus and the criminals there, one on his right, the other on his left. Now one of the criminals hanging there reviled Jesus, saying, Are you not the Christ? Save yourself and us. The other man, however, rebuking him, said in reply, Have you no fear of God, for you are subject to the same condemnation? And indeed, we have been condemned justly, for the sentence we received corresponds to our crimes, but this man has done nothing criminal. Then he said, Jesus, remember me when you come into your Kingdom. He replied to him, Amen, I say to you, today you will be with me in Paradise.',
    categories: ['Funeral', 'Gospel'],
    language: 'English',
    introduction: 'A reading from the holy Gospel according to Luke',
    conclusion: 'The Gospel of the Lord.'
  },
  {
    id: 9,
    pericope: 'Luke 23:44-46,50,52;24:1-6a',
    text: 'It was about noon and darkness came over the whole land until three in the afternoon because of an eclipse of the sun. Then the veil of the temple was torn down the middle. Jesus cried out in a loud voice, Father, into your hands I commend my spirit; and when he had said this he breathed his last. Now there was a virtuous and righteous man named Joseph who, though he was a member of the council, went to Pilate and asked for the Body of Jesus. After he had taken the Body down, he wrapped it in a linen cloth and laid him in a rock-hewn tomb in which no one had yet been buried. At daybreak on the first day of the week the women took the spices they had prepared and went to the tomb. They found the stone rolled away from the tomb; but when they entered, they did not find the Body of the Lord Jesus. While they were puzzling over this, behold, two men in dazzling garments appeared to them. They were terrified and bowed their faces to the ground. They said to them, Why do you seek the living one among the dead? He is not here, but he has been raised.',
    categories: ['Funeral', 'Gospel'],
    language: 'English',
    introduction: 'A reading from the holy Gospel according to Luke',
    conclusion: 'The Gospel of the Lord.'
  },
  {
    id: 10,
    pericope: 'Luke 24:13-35',
    text: 'That very day, the first day of the week, two of the disciples of Jesus were going to a village called Emmaus, seven miles from Jerusalem, and they were conversing about all the things that had occurred. And it happened that while they were conversing and debating, Jesus himself drew near and walked with them, but their eyes were prevented from recognizing him. He asked them, What are you discussing as you walk along? They stopped, looking downcast. One of them, named Cleopas, said to him in reply, Are you the only visitor to Jerusalem who does not know of the things that have taken place there in these days? And he replied to them, What sort of things? They said to him, The things that happened to Jesus the Nazarene, who was a prophet mighty in deed and word before God and all the people, how our chief priests and rulers both handed him over to a sentence of death and crucified him. But we were hoping that he would be the one to redeem Israel; and besides all this, it is now the third day since this took place. Some women from our group, however, have astounded us; they were at the tomb early in the morning and did not find his Body; they came back and reported that they had indeed seen a vision of angels who announced that he was alive. Then some of those with us went to the tomb and found things just as the women had described, but him they did not see. And he said to them, Oh, how foolish you are! How slow of heart to believe all that the prophets spoke! Was it not necessary that the Christ should suffer these things and enter into his glory? Then beginning with Moses and all the prophets, Jesus interpreted to them what referred to him in all the Scriptures. As they approached the village to which they were going, Jesus gave the impression that he was going on farther. But they urged him, Stay with us, for it is nearly evening and the day is almost over. So he went in to stay with them. And it happened that, while he was with them at table, he took bread, said the blessing, broke it, and gave it to them. With that their eyes were opened and they recognized him, but he vanished from their sight. Then they said to each other, Were not our hearts burning within us while he spoke to us on the way and opened the Scriptures to us? So they set out at once and returned to Jerusalem where they found gathered together the Eleven and those with them, who were saying, The Lord has truly been raised and has appeared to Simon! Then the two recounted what had taken place on the way and how he was made known to them in the breaking of the bread.',
    categories: ['Funeral', 'Gospel'],
    language: 'English',
    introduction: 'A reading from the holy Gospel according to Luke',
    conclusion: 'The Gospel of the Lord.'
  },
  {
    id: 11,
    pericope: 'John 5:24-29',
    text: 'Jesus answered the Jews and said to them: Amen, amen, I say to you, whoever hears my word and believes in the one who sent me has eternal life and will not come to condemnation, but has passed from death to life. Amen, amen, I say to you, the hour is coming and is now here when the dead will hear the voice of the Son of God, and those who hear will live. For just as the Father has life in himself, so also he gave to the Son the possession of life in himself. And he gave him power to exercise judgment, because he is the Son of Man. Do not be amazed at this, because the hour is coming in which all who are in the tombs will hear his voice and will come out, those who have done good deeds to the resurrection of life, but those who have done wicked deeds to the resurrection of condemnation.',
    categories: ['Funeral', 'Gospel'],
    language: 'English',
    introduction: 'A reading from the holy Gospel according to John',
    conclusion: 'The Gospel of the Lord.'
  },
  {
    id: 12,
    pericope: 'John 6:37-40',
    text: 'Jesus said to the crowds: Everything that the Father gives me will come to me, and I will not reject anyone who comes to me, because I came down from heaven not to do my own will but the will of the one who sent me. And this is the will of the one who sent me, that I should not lose anything of what he gave me, but that I should raise it on the last day. For this is the will of my Father, that everyone who sees the Son and believes in him may have eternal life, and I shall raise him on the last day.',
    categories: ['Funeral', 'Gospel'],
    language: 'English',
    introduction: 'A reading from the holy Gospel according to John',
    conclusion: 'The Gospel of the Lord.'
  },
  {
    id: 13,
    pericope: 'John 6:51-59',
    text: 'Jesus said to the crowds: I am the living bread that came down from heaven; whoever eats this bread will live forever; and the bread that I will give is my Flesh for the life of the world. The Jews quarreled among themselves, saying, How can this man give us his Flesh to eat? Jesus said to them, Amen, amen, I say to you, unless you eat the Flesh of the Son of Man and drink his Blood, you do not have life within you. Whoever eats my Flesh and drinks my Blood has eternal life, and I will raise him on the last day. For my Flesh is true food, and my Blood is true drink. Whoever eats my Flesh and drinks my Blood remains in me and I in him. Just as the living Father sent me and I have life because of the Father, so also the one who feeds on me will have life because of me. This is the bread that came down from heaven. Unlike your ancestors who ate and still died, whoever eats this bread will live forever.',
    categories: ['Funeral', 'Gospel'],
    language: 'English',
    introduction: 'A reading from the holy Gospel according to John',
    conclusion: 'The Gospel of the Lord.'
  },
  {
    id: 14,
    pericope: 'John 11:17-27',
    text: 'When Jesus arrived in Bethany, he found that Lazarus had already been in the tomb for four days. Now Bethany was near Jerusalem, only about two miles away. Many of the Jews had come to Martha and Mary to comfort them about their brother. When Martha heard that Jesus was coming, she went to meet him; but Mary sat at home. Martha said to Jesus, Lord, if you had been here, my brother would not have died. But even now I know that whatever you ask of God, God will give you. Jesus said to her, Your brother will rise. Martha said to him, I know he will rise, in the resurrection on the last day. Jesus told her, I am the resurrection and the life; whoever believes in me, even if he dies, will live, and everyone who lives and believes in me will never die. Do you believe this? She said to him, Yes, Lord. I have come to believe that you are the Christ, the Son of God, the one who is coming into the world.',
    categories: ['Funeral', 'Gospel'],
    language: 'English',
    introduction: 'A reading from the holy Gospel according to John',
    conclusion: 'The Gospel of the Lord.'
  },
  {
    id: 15,
    pericope: 'John 11:32-45',
    text: 'When Mary came to where Jesus was and saw him, she fell at his feet and said to him, Lord, if you had been here, my brother would not have died. When Jesus saw her weeping and the Jews who had come with her weeping, he became perturbed and deeply troubled, and said, Where have you laid him? They said to him, Sir, come and see. And Jesus wept. So the Jews said, See how he loved him. But some of them said, Could not the one who opened the eyes of the blind man have done something so that this man would not have died? So Jesus, perturbed again, came to the tomb. It was a cave, and a stone lay across it. Jesus said,  Take away the stone. Martha, the dead man sister, said to him,  Lord, by now there will be a stench; he has been dead for four days. Jesus said to her, Did I not tell you that if you believe you will see the glory of God? So they took away the stone. And Jesus raised his eyes and said, Father, I thank you for hearing me. I know that you always hear me; but because of the crowd here I have said this, that they may believe that you sent me. And when he had said this, he cried out in a loud voice, Lazarus, come out! The dead man came out, tied hand and foot with burial bands, and his face was wrapped in a cloth. So Jesus said to the crowd, Untie him and let him go. Now many of the Jews who had come to Mary and seen what he had done began to believe in him.',
    categories: ['Funeral', 'Gospel'],
    language: 'English',
    introduction: 'A reading from the holy Gospel according to John',
    conclusion: 'The Gospel of the Lord.'
  },
  {
    id: 16,
    pericope: 'John 12:23-28',
    text: 'Jesus said to his disciples: The hour has come for the Son of Man to be glorified. Amen, amen, I say to you, unless a grain of wheat falls to the ground and dies, it remains just a grain of wheat; but if it dies, it produces much fruit. Whoever loves his life will lose it, and whoever hates his life in this world will preserve it for eternal life. Whoever serves me must follow me, and where I am, there also will my servant be. The Father will honor whoever serves me. I am troubled now. Yet what should I say? Father, save me from this hour? But it was for this purpose that I came to this hour. Father, glorify your name. Then a voice came from heaven, I have glorified it and will glorify it again.',
    categories: ['Funeral', 'Gospel'],
    language: 'English',
    introduction: 'A reading from the holy Gospel according to John',
    conclusion: 'The Gospel of the Lord.'
  },
  {
    id: 17,
    pericope: 'John 14:1-6',
    text: 'Jesus said to his disciples: Do not let your hearts be troubled. You have faith in God; have faith also in me. In my Father house there are many dwelling places. If there were not, would I have told you that I am going to prepare a place for you? And if I go and prepare a place for you, I will come back again and take you to myself, so that where I am you also may be. Where I am going you know the way. Thomas said to him, Master, we do not know where you are going; how can we know the way? Jesus said to him, I am the way and the truth and the life. No one comes to the Father except through me.',
    categories: ['Funeral', 'Gospel'],
    language: 'English',
    introduction: 'A reading from the holy Gospel according to John',
    conclusion: 'The Gospel of the Lord.'
  },
  {
    id: 18,
    pericope: 'John 17:24-26',
    text: 'Jesus raised his eyes to heaven and said: Father, those whom you gave me are your gift to me. I wish that where I am they also may be with me, that they may see my glory that you gave me, because you loved me before the foundation of the world. Righteous Father, the world also does not know you, but I know you, and they know that you sent me. I made known to them your name and I will make it known, that the love with which you loved me may be in them and I in them.',
    categories: ['Funeral', 'Gospel'],
    language: 'English',
    introduction: 'A reading from the holy Gospel according to John',
    conclusion: 'The Gospel of the Lord.'
  },
  {
    id: 19,
    pericope: 'John 19:17-18,25-39',
    text: 'So they took Jesus, and, carrying the cross himself, he went out to what is called the Place of the Skull, in Hebrew, Golgotha. There they crucified him, and with him two others, one on either side, with Jesus in the middle. Standing by the cross of Jesus were his mother and his mother sister. Mary the wife of Clopas, and Mary Magdalene. When Jesus saw his mother and the disciple whom he loved, he said to his mother, Woman, behold, your son. Then he said to the disciple, Behold, your mother. And from that hour the disciple took her into his home. After this, aware that everything was now finished, in order that the Scripture might be fulfilled, Jesus said, I thirst. There was a vessel filled with common wine. So they put a sponge soaked in wine on a sprig of hyssop and put it up to his mouth. When Jesus had taken the wine, he said, It is finished. And bowing his head, he handed over the Spirit. Now since it was preparation day, in order that the bodies might not remain on the cross on the Sabbath, for the Sabbath day of that week was a solemn one, the Jews asked Pilate that their legs be broken and they be taken down. So the soldiers came and broke the legs of the first and then of the other one who was crucified with Jesus. But when they came to Jesus and saw that he was already dead, they did not break his legs, but one soldier thrust his lance into his side, and immediately Blood and water flowed out. An eyewitness has testified, and his testimony is true; he knows that he is speaking the truth, so that you also may come to believe. For this happened so that the Scripture passage might be fulfilled: Not a bone of it will be broken. And again another passage says: They will look upon him whom they have pierced. After this, Joseph of Arimathea, secretly a disciple of Jesus for fear of the Jews, asked Pilate if he could remove the Body of Jesus. And Pilate permitted it. So he came and took his Body. Nicodemus, the one who had first come to him at night, also came bringing a mixture of myrrh and aloes weighing about one hundred pounds.',
    categories: ['Funeral', 'Gospel'],
    language: 'English',
    introduction: 'A reading from the holy Gospel according to John',
    conclusion: 'The Gospel of the Lord.'
  },
  {
    id: 20,
    pericope: '2 Maccabees 12:43-46',
    text: 'Judas, the ruler of Israel, took up a collection among all his soldiers, amounting to two thousand silver drachmas, which he sent to Jerusalem to provide for an expiatory sacrifice.  In doing this he acted in a very excellent and noble way, inasmuch as he had the resurrection of the dead in view; for if he were not expecting the fallen to rise again, it would have been useless and foolish to pray for them in death.  But if he did this with a view to the splendid reward that awaits those who had gone to rest in godliness, it was a holy and pious thought. Thus he made atonement for the dead that they might be freed from this sin.',
    categories: ['Funeral'],
    language: 'English',
    introduction: 'A reading from the second Book of Maccabees',
    conclusion: 'The word of the Lord.'
  },
  {
    id: 21,
    pericope: 'Job 19:1,23-27a',
    text: 'Job answered Bildad the Shuhite and said: Oh, would that my words were written down! Would that they were inscribed in a record: That with an iron chisel and with lead they were cut in the rock forever! But as for me, I know that my Vindicator lives, and that he will at last stand forth upon the dust; Whom I myself shall see: my own eyes, not another, shall behold him; And from my flesh I shall see God; my inmost being is consumed with longing.',
    categories: ['Funeral'],
    language: 'English',
    introduction: 'A reading from the Book of Job',
    conclusion: 'The word of the Lord.'
  },
  {
    id: 22,
    pericope: 'Wisdom 3:1-9',
    text: 'The souls of the just are in the hand of God, and no torment shall touch them. They seemed, in the view of the foolish, to be dead; and their passing away was thought an affliction and their going forth from us, utter destruction. But they are in peace. For if before men, indeed they be punished, yet is their hope full of immortality; Chastised a little, they shall be greatly blessed, because God tried them and found them worthy of himself. As gold in the furnace, he proved them, and as sacrificial offerings he took them to himself. In the time of their visitation they shall shine, and shall dart about as sparks through stubble; They shall judge nations and rule over peoples, and the Lord shall be their King forever. Those who trust in him shall understand truth, and the faithful shall abide with him in love: Because grace and mercy are with his holy ones, and his care is with his elect.',
    categories: ['Funeral'],
    language: 'English',
    introduction: 'A reading from the Book of Wisdom',
    conclusion: 'The word of the Lord.'
  },
  {
    id: 23,
    pericope: 'Wisdom 4:7-15',
    text: 'The just man, though he die early, shall be at rest. For the age that is honorable comes not with the passing of time, nor can it be measured in terms of years. Rather, understanding is the hoary crown for men, and an unsullied life, the attainment of old age. He who pleased God was loved; he who lived among sinners was transported - Snatched away, lest wickedness pervert his mind or deceit beguile his soul; For the witchery of paltry things obscures what is right and the whirl of desire transforms the innocent mind. Having become perfect in a short while, he reached the fullness of a long career; for his soul was pleasing to the Lord, therefore he sped him out of the midst of wickedness. But the people saw and did not understand, nor did they take this into account.',
    categories: ['Funeral'],
    language: 'English',
    introduction: 'A reading from the Book of Wisdom',
    conclusion: 'The word of the Lord.'
  },
  {
    id: 24,
    pericope: 'Isaiah 25:6a,7-9',
    text: 'On this mountain the Lord of hosts will provide for all peoples. On this mountain he will destroy the veil that veils all peoples, The web that is woven over all nations; he will destroy death forever. The Lord God will wipe away the tears from all faces; The reproach of his people he will remove from the whole earth; for the Lord has spoken. On that day it will be said: Behold our God, to whom we looked to save us! This is the Lord for whom we looked; let us rejoice and be glad that he has saved us!',
    categories: ['Funeral'],
    language: 'English',
    introduction: 'A reading from the Book of the Prophet Isaiah',
    conclusion: 'The word of the Lord.'
  },
  {
    id: 25,
    pericope: 'Lamentations 3:17-26',
    text: 'My soul is deprived of peace, I have forgotten what happiness is; I tell myself my future is lost, all that I hoped for from the Lord. The thought of my homeless poverty is wormwood and gall; Remembering it over and over leaves my soul downcast within me. But I will call this to mind, as my reason to have hope: The favors of the Lord are not exhausted, his mercies are not spent; They are renewed each morning, so great is his faithfulness. My portion is the Lord, says my soul; therefore will I hope in him. Good is the Lord to one who waits for him, to the soul that seeks him; It is good to hope in silence for the saving help of the Lord.',
    categories: ['Funeral'],
    language: 'English',
    introduction: 'A reading from the Book of Lamentations',
    conclusion: 'The word of the Lord.'
  },
  {
    id: 26,
    pericope: 'Daniel 12:1-3',
    text: 'In those days, I, Daniel, mourned and heard this word of the Lord: At that time there shall arise Michael, the great prince, guardian of your people; It shall be a time unsurpassed in distress since nations began until that time. At that time your people shall escape, everyone who is found written in the book. Many of those who sleep in the dust of the earth shall awake; Some shall live forever, others shall be an everlasting horror and disgrace. But the wise shall shine brightly like the splendor of the firmament, And those who lead the many to justice shall be like the stars forever.',
    categories: ['Funeral'],
    language: 'English',
    introduction: 'A reading from the Book of the Prophet Daniel',
    conclusion: 'The word of the Lord.'
  },
  {
    id: 27,
    pericope: 'Acts 10:34-43',
    text: 'Peter proceeded to speak, saying:  In truth, I see that God shows no partiality. Rather, in every nation whoever fears him and acts uprightly is acceptable to him. You know the word that he sent to the children of Israel as he proclaimed peace through Jesus Christ, who is Lord of all, what has happened all over Judea, beginning in Galilee after the baptism that John preached, how God anointed Jesus of Nazareth with the Holy Spirit and power. He went about doing good and healing all those oppressed by the Devil, for God was with him. We are witnesses of all that he did both in the country of the Jews and in Jerusalem. They put him to death by hanging him on a tree. This man God raised on the third day and granted that he be visible, not to all the people, but to us, the witnesses chosen by God in advance, who ate and drank with him after he rose from the dead. He commissioned us to preach to the people and testify that he is the one appointed by God as judge of the living and the dead. To him all the prophets bear witness, that everyone who believes in him will receive forgiveness of sins through his name.',
    categories: ['Funeral'],
    language: 'English',
    introduction: 'A reading from the Acts of the Apostles',
    conclusion: 'The word of the Lord.'
  },
  {
    id: 28,
    pericope: 'Revelation 14:13',
    text: 'I, John, heard a voice from heaven say, Write this: Blessed are the dead who die in the Lord from now on. Yes, said the Spirit, let them find rest from their labors, for their works accompany them.',
    categories: ['Funeral'],
    language: 'English',
    introduction: 'A reading from the Book of Revelation',
    conclusion: 'The word of the Lord.'
  },
  {
    id: 29,
    pericope: 'Revelation 20:11-21:1',
    text: 'I, John, saw a large white throne and the one who was sitting on it. The earth and the sky fled from his presence and there was no place for them. I saw the dead, the great and the lowly, standing before the throne, and scrolls were opened. Then another scroll was opened, the book of life. The dead were judged according to their deeds, by what was written in the scrolls. The sea gave up its dead; then Death and Hades gave up their dead. All the dead were judged according to their deeds. Then Death and Hades were thrown into the pool of fire. (This pool of fire is the second death.) Anyone whose name was not found written in the book of life was thrown into the pool of fire.  Then I saw a new heaven and a new earth. The former heaven and the former earth had passed away, and the sea was no more.',
    categories: ['Funeral'],
    language: 'English',
    introduction: 'A reading from the Book of Revelation',
    conclusion: 'The word of the Lord.'
  },
  {
    id: 30,
    pericope: 'Revelation 21:1-5a,6b-7',
    text: 'I, John, saw a new heaven and a new earth. The former heaven and the former earth had passed away, and the sea was no more, I also saw the holy city, a new Jerusalem, coming down out of heaven from God, prepared as a bride adorned for her husband. I heard a loud voice from the throne saying, Behold, God dwelling is with the human race. He will dwell with them and they will be his people and God himself will always be with them as their God. He will wipe every tear from their eyes, and there shall be no more death or mourning, wailing or pain, for the old order has passed away.  The One who sat on the throne said, Behold, I make all things new. I am the Alpha and the Omega, the beginning and the end. To the thirsty I will give a gift from the spring of life-giving water. The victor will inherit these gifts, and I shall be his God, and he will be my son.',
    categories: ['Funeral'],
    language: 'English',
    introduction: 'A reading from the Book of Revelation',
    conclusion: 'The word of the Lord.'
  },
  {
    id: 31,
    pericope: 'Ecclesiastes 3:1-11',
    text: 'There is an appointed time for everything, and a time for every thing under the heavens. A time to be born, and a time to die; a time to plant, and a time to uproot the plant. A time to kill, and a time to heal; a time to tear down, and a time to build. A time to weep, and a time to laugh; a time to mourn, and a time to dance. A time to scatter stones, and a time to gather them; a time to embrace, and a time to be far from embraces. A time to seek, and a time to lose; a time to keep, and a time to cast away. A time to rend, and a time to sew; a time to be silent, and a time to speak. A time to love, and a time to hate; a time of war, and a time of peace.',
    categories: ['General'],
    language: 'English',
    introduction: 'A reading from the Book of Ecclesiastes',
    conclusion: 'The word of the Lord.'
  }
  // More readings can be added here as needed
]