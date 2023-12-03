// Made by Firstname Lastname (keep this line and replace with your name)

function dayXPreload() {

    // Load any assets here (with assets.dayX at the front of the variable name)
    assets.daySam = new DaySamAssets();
    console.log("Loaded DayX");
}

// -------------------------------------------------------------------------------
class DaySamAssets {
    constructor() {
        this.font = loadFont(this.assetFilename("Assiduous-9m35.ttf"));
        this.loadingScreen = loadImage(this.imageFilename('loadingscreen.png'));
        
        this.music = new Audio(this.assetFilename('simcity2000_bells.mp3'));
        this.music.loop = true;
        this.musicOn = true;

        var sprites = [];
        // Empty grid square
        sprites[0] = loadImage(this.imageFilename('empty.png'));
        // Trees
        this.trees = [1000,1001,1002,1003];
        sprites[1000] = loadImage(this.imageFilename('tree1.png'));
        sprites[1001] = loadImage(this.imageFilename('tree2.png'));
        sprites[1002] = loadImage(this.imageFilename('tree3.png'));
        sprites[1003] = loadImage(this.imageFilename('tree4.png'));

        // Structures
        this.houses = [1,2,3,4];
        sprites[1] = loadImage(this.imageFilename('house1.png'));
        sprites[2] = loadImage(this.imageFilename('house2.png'));
        sprites[3] = loadImage(this.imageFilename('house3.png'));
        sprites[4] = loadImage(this.imageFilename('house4.png'));
        this.church = 10;
        this.hospital = 11;
        this.bar = 12;
        this.decoratedtree = 13;
        this.park = 14;
        this.snowperson = 15;
        sprites[this.church] = loadImage(this.imageFilename('church.png'));
        sprites[this.hospital] = loadImage(this.imageFilename('hospital.png'));
        sprites[this.bar] = loadImage(this.imageFilename('bar.png'));
        sprites[this.decoratedtree] = loadImage(this.imageFilename('decoratedtree.png'));
        sprites[this.park] = loadImage(this.imageFilename('park.png'));
        sprites[this.snowperson] = loadImage(this.imageFilename('snowperson.png'));
        this.monuments = [this.church,this.hospital,this.bar,this.decoratedtree,this.park,this.snowperson]
        
        // Roads
        // To simplify checks later, make road tiles -ve
        this.leftroad = -1;
        this.uproad = -2;
        this.crossroad = -3;
        sprites[this.leftroad] = loadImage(this.imageFilename('road_leftright.png'));
        sprites[this.uproad] = loadImage(this.imageFilename('road_updown.png'));
        sprites[this.crossroad] = loadImage(this.imageFilename('road_cross.png'));
        
        // Mobs
        this.mobs = [2000,2001,2002,2003,2004];
        sprites[2000] = loadImage(this.imageFilename('mob1.png'));
        sprites[2001] = loadImage(this.imageFilename('mob2.png'));
        sprites[2002] = loadImage(this.imageFilename('mob3.png'));
        sprites[2003] = loadImage(this.imageFilename('mob4.png'));
        sprites[2004] = loadImage(this.imageFilename('mob5.png'));

        // Alien robot
        this.alien = 3000;
        this.teleport = 3001;
        this.present = 3002;
        sprites[this.alien] = loadImage(this.imageFilename('alienrobot.png'));
        sprites[this.teleport] = loadImage(this.imageFilename('teleport.png'));
        sprites[this.present] = loadImage(this.imageFilename('present.png'));

        this.sprites = sprites;

    }

    assetFilename(filename) {
        return "../assets/daysam/"+filename;
    }

    imageFilename(filename) {
        return "../assets/daysam/images/"+filename;
    }

    sprite(spriteID) {
        return this.sprites[spriteID];
    }

    playmusic() {
        if (this.musicOn) this.music.play();
    }

    stopmusic() {
        this.music.pause();
        this.music.fastSeek(0);
    }

    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }


}

// -------------------------------------------------------------------------------
class DayX extends Day {

    constructor () {

        super();
        this.loop = true; // Set to true or false

        this.controls = ""; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by &#127750; Sam &#129433;"; // Replace with your name

        // Define variables here. Runs once during the sketch holder setup 
        this.assets = assets.daySam
        this.assetsFolder = "../assets/daysam/";
        this.music = 0;
        this.startTime = 0;
        this.aiDelay = 0;
        this.nextAIDelay = 2000;
        this.tickerDelay = 0;
        this.nextTickerDelay = 1000;
        this.maxTickerLifetime = 5000;
        this.tickerLifetime = this.maxTickerLifetime;
        this.mobDelay = 3000;
        this.nextMobDelay = 3000;
        this.alienDelay = 0;
        this.nextAlienDelay = 5*60*1000;
        this.tickerText = "";
        this.city = 0;
        this.loading = false;
        this.loadingReady = false;
        // Set to false to run with launcher and music
        this.DEBUG = false;
    }

    cleanup () {
        
        this.assets.stopmusic();
        console.log("Stopping jingly music");
    }

    prerun() {

        // Initialise/reset variables here. Runs once, every time your day is viewed
        this.startTime = millis()
        this.city = new this.City(this)
        if (!this.DEBUG) {
            this.loading = true;
        }
        this.loadingReady = false;
    }

    time() {
        return 0.001*(millis() - this.startTime);
    }

    loadingUpdates() {
        
        image(this.assets.loadingScreen, 0, 0, width, height);

        textFont(this.assets.font);
        textAlign(CENTER, TOP);
        rectMode(CENTER);

        fill(255,0,0);

        var loadingTxt = "RETICULATING SPLINES";
        var llamapos = width/2+6+200;
        var fsize = 110;
        var fsizesmall = 45;
        if (this.time() > 0.5) {
            loadingTxt += "."
            llamapos -= 100
        }
        if (this.time() > 1.0) {
            loadingTxt += "."
            llamapos -= 100
        }
        if (this.time() > 1.5) {
            loadingTxt += "."
            llamapos -= 100
        }
        if (this.time() > 2) {
            this.loadingReady = true;
            llamapos -= 100
        }
        textSize(fsize);
        textFont("Arial");
        text("🦙", llamapos, height/2+fsize);
        textFont(this.assets.font);
        if (!this.loadingReady) {
           textSize(fsizesmall);
           text(loadingTxt, width/2+6, height/2.9);
        }
        else {
            textSize(fsize);
            text("SANTA CITY", width/2+6, height/4-5);
            textSize(fsize);
            text("2000", width/2+6-93, height/4+fsize-25);
            textFont("Arial");
            text("▶", width/2+6+80, height/4+fsize-20);

        }
    }

    update() {


        // Update and draw stuff here. Runs continuously (or only once if this.loop = false), while your day is being viewed
        background(200); // You can delete this line if you want

        if (this.loading) {
            this.loadingUpdates();
        }
        else {
            // This should be a delay class or something huh!
            // I am become what I hate
            // No I won't refactor this
            // I know
            var minAIDelay = 2000;
            var maxAIDelay = 8000;
            var minTickerDelay = 7000;
            var maxTickerDelay = 10000;
            var minMobDelay = 2000;
            var maxMobDelay = 8000;
            var minAlienDelay = 5*60*1000;
            var maxAlienDelay = 10*60*1000;
            this.aiDelay += deltaTime;
            this.tickerDelay += deltaTime;
            this.mobDelay += deltaTime;
            this.alienDelay += deltaTime;
            // AI event timer
            if (this.aiDelay > this.nextAIDelay) {
                this.city.stepAI();
                this.aiDelay = 0;
                this.nextAIDelay = (maxAIDelay-minAIDelay)*Math.random()+minAIDelay;
            }
            // Ticker spawn timer
            if (this.tickerDelay > this.nextTickerDelay) {
                this.generateTickerText();
                this.tickerDelay = 0;
                this.tickerLifetime = this.maxTickerLifetime;
                this.nextTickerDelay = (maxTickerDelay-minTickerDelay)*Math.random()+minTickerDelay;
            }
            // Mob spawn timer
            if (this.mobDelay > this.nextMobDelay) {
                this.city.spawnMob();
                this.mobDelay = 0;
                this.nextMobDelay = (maxMobDelay-minMobDelay)*Math.random()+minMobDelay;
            }
            // Set delay to a second if testing
            if (this.DEBUG) {
                this.nextAlienDelay = 1000;
            }
            // Alien robot spawn timer
            if (this.alienDelay > this.nextAlienDelay) {
                this.city.spawnAlien();
                this.alienDelay = 0;
                this.nextAlienDelay = (maxAlienDelay-minAlienDelay)*Math.random()+minAlienDelay;
            }
            // Handle mobs
            this.city.moveMobs();
            // Draw city
            this.city.draw();
            // Draw game UI
            this.drawGameUI()
        }
        // Draw UI for all scenes
        this.drawAllUI();
    }

    drawInfo() {
        fill(215,123,186);
        textFont(this.assets.font);
        textAlign(LEFT, TOP);
        rectMode(CENTER);
        var fsizesmall = 20;
        textSize(fsizesmall);
        var textMusic = "Turn music on: M";
        if (this.assets.musicOn) {
            textMusic = "Turn music off: M";
        }
        text(textMusic, 10,10);
    }

    drawAllUI () {
        // Draw info
        this.drawInfo();
    }

    drawGameUI () {
        // Draw news ticker
        this.drawNewsTicker();
        // Draw city info
        this.drawCityInfo();
    }

    generateTickerText() {
        var choice = Math.random();
        var text = "";
        var newsItems = ["Dogs should be able to vote",
                    "Walkable neighborhood becomes more walkable with extra strong candy canes",
                    "Libertarian council celebrates 5 years in office; polar bears run amok",
                    "Candle tax up by 37%",
                    "DO NOT PANIC HUMANS, IT IS I, HUMAN MAYOR",
                    "Llama escaped from zoo; please remain indoors",
                    "Winter festival extended by another week. Mayor: 'Haha, I'm sure it'll be spring soon. Heh.'",
                    "Cocoa sold out across the county thanks to new online craze",
                    "Troll sighting in Jorgensvord - bridge closed for duration",
                    "Councillor fired for misappropriation of public stocking stuffers",
                    "Bridge falls down, rebar found to be made of candy cane",
                    "It's infrastructure week! Bring your shovel",
                    "Horoscope says: 'don't worry about it'",
                    "Wrapping paper falls 5%, markets panic",
                    "Elves on strike: 'Give us elf benefits'",
                    "Yeti on the loose, stay clear of Jinglestreet and 4th",
                    "Scientists hope flying sleighs will improve traffic downtown",
                    "Ski season is here again! Pack your goggles and yeti spray",
                    "Is your body December ready?",
                    "Pumpkin Lobby: Carving is fun in December too!",
                    "Chimney widening law now in effect: are you compliant?",
                    "Ugly jumper escapes zoo; citizens concerned",
                    "Nakatomi Plaza under siege third for time this month",
                    "Paddling pool freezes over: 'I was stuck there for hours'",
                    "New winter trend: having a nice time in the snow",
                    "Scientists discover chemicals in local water that make frogs cute",
                    "Local councillor Gorp Jolkins declares 'Gorpmania', hopes to sweep polls",
                    "New craze: skiing uphill. Local skiier Henk Korn: 'Screw you, gravity!'",
                    "Local yetis report finding it hard to chase skiiers due to poor exercise levels",
                    "Local residents complain that they burned their marshmallows on the fire",
                    "Local snowperson committee calls for tax freeze",
                    "Boo, Mayor, Boo! - some citizens, probably",
                    "76% of citizens say 'Ho ho ho' - Mayor's office unavailable for comment",
                    "Yay, Mayor, Yay! - all the citizens :)",
                    "Sicko's realases the crince pie - it's a croissant with a mince pie in it",
                    "Citizens report increasing levels of toasty warmness - Mayoral commission launched",
                    "Scientists discover anticocoa - it's a large marshmallow with a hot chocolate nucleus"];
        var firstNames = ["Councillor","Councillor","Councillor",
                      "Bork","Krampus","Hehe","Gronulsluk","Hilde","Wimpsifer","Harnald","Golb","Tilbert",
                      "Yarnis","Pilgou","Tripp","Horkhork","Wisper","Tramine","Colbit","Dilken"];
        var lastNames = ["Kringle","Hanksil","Jorglas","Jormis","Jorbs","Senni","Lueioe","Gorpgon",
                         "Jolgrampus","Jingle","Santasson","Snowperson","Abominable","Pudding"];
        var personalMessages = ["You can't cut the road budget! You will regret this!",
                                "I ate too many lebkuchen and it's the mayor's fault",
                                "Candle tax is way too high!",
                                "Time to hibernate, see you next spring",
                                "When is the next bus? I've been waiting ages!",
                                "Thanks for the new nuclear plant! Makes me feel all toasty",
                                "I was kicked really hard by a reindeer :( #publichealthcare",
                                "The price of carrots is too high! Where am I going to find a nose?",
                                "My tree caught fire :( Thanks fire service :)",
                                "Come check out my snowman! Mayor! Come check it out!",
                                "You have won a million lollipops! Click here to claim",
                                "Thanks for the cycle-friendly infrastructure, mayor! NOT",
                                "I lost my dog. Can you help look for her? Her name is Biffles",
                                "My sibling is visiting town - can they crash at the Mayor's House for a bit?",
                                "Wow! The lights are amazing! Thanks, Mayor!",
                                "I broke the ice for the ducks - they seem to be having fun now",
                                "Singing holiday songs to the old folks until they chase me out",
                                "Oh wassail oh wassail all over the town, the roads they are pink and the reindeer poop's brown",
                                "Old man was stuck on my roof - says his sleigh went off without him",
                                "Thanks for the new tree, Mayor! Looks fancy in the town square",
                                "You know what pastry tastes the freshest? Mints pies! I said, mints pies! MINTS P-",
                                "Robins are eating all the squirrel seed! The mayor must do something",
                                "All this reindeer poop is making my commute a mess! Ugh",
                                "I preferred it when this app was called Quacker. Fix it!",
                                "Ugh, another high-rise snowperson blocking the view from my house. Stop this nonsense!",
                                "Help! Santa's sleigh is coming right for me! It's about to-",
                                "This jumper is suuuper ugly. Ugh. I must have it.",
                                "Look at the stars! Look how they shine on you. Their colour is set by surface temperature.",
                                "Gonna get some oilballs from the oilball stand, delicious",
                                "Oh so you fireproof the big goat? Huh? You fireproof the big goat?? Well good for you.",
                                "Real candles on the tree or get out. No compromise.",
                                "Aww, your dog is adorable! Can I pet them?",
                                "Hey I found the winter dragon and its egg is hatching, what's the number for the vet?",
                                "I'm making Mystery Surprise for dinner - can you pick up the ingredients on the way home?",
                                "Wetty's sells the most delicious candles - you have to try one!"];
        var text = ""
        if (choice < 0.5) {
            text = "Newsflash: "
            text += this.assets.randomChoice(newsItems);
        } else {
            var name = this.assets.randomChoice(firstNames)+" "+this.assets.randomChoice(lastNames)
            text = name+": "+this.assets.randomChoice(personalMessages);
        }
        this.tickerText = text;
        console.log("Generated ticker text:", text)
    }

    drawNewsTicker() {
        if (this.tickerLifetime <= 0) return
        this.tickerLifetime -= deltaTime;
        fill(215,123,186);
        textFont(this.assets.font);
        textAlign(CENTER, BOTTOM);
        rectMode(CENTER);
        var fsizesmall = 20;
        textSize(fsizesmall);
        text(this.tickerText, width/2,height-10,width-20);



    }

    drawCityInfo() {
        fill(215,123,186);
        textFont(this.assets.font);
        textAlign(CENTER, TOP);
        rectMode(CENTER);
        var fsizesmall = 20;
        textSize(fsizesmall);
        text(this.city.cityInfo(), width/2,10,width-20);
    }

    startPlay() {
        // Start the main play level from loading (DEBUG bypasses this)
        this.loading = false;
        this.loadingReady = false;
        this.assets.playmusic();
        console.log("Playing jingly music");
    }

    // Below are optional functions for interactivity. They can be deleted from this file if you want

    mousePressed() {
        if (this.loadingReady) {
            this.startPlay();
        }
        if (this.DEBUG) {
            if (!this.loading) {
                this.city.stepAI();
            }
        }
    }

    mouseReleased() {
        // No behaviour
    }


    keyPressed() {
        if (key == "m" || key == "M") {
            if (this.assets.musicOn) {
                this.assets.musicOn = false;
                this.assets.stopmusic();
            } else {
                this.assets.musicOn = true;
                this.assets.playmusic();
            }
        } else {
            if (this.loadingReady) {
                this.startPlay()
            }
        }
    }

    keyReleased() {
        // No behaviour
    }

    // -------------------------------------------------------------------------------
    City = class {

        constructor(day) {
            this.day = day;
            this.assets = day.assets;
            this.map = new this.Map(this);
            this.mobs = []
            this.maxMobCount = 20;
            this.name = this.makeName()
            this.alienRobot = null;
            this.population = 0
        }

        makeName() {
            var prefixes = ["New","Old","Castle","Little","Upper","Lower","Royal"]
            var words = ["Gorp","Wendigo","Santa","Kranston","Jingle","Harty","Winterland","Canadia","Snowfield",
                     "Elf","Troll","Gnome","Snug","Warmth","Cosy","Presents","Peace","Jorbis","Garm","Jolvar","Jolly"]
            var suffixes = ["opolis","ton","hame","home","holm","town"," City","ford"," Crossing"," Junction"," Village",
                      "ville","haim","castle"]
            var cityname = ""
            if (Math.random() < 0.5) cityname += this.assets.randomChoice(prefixes)+" "
            cityname += this.assets.randomChoice(words)
            if (Math.random() < 0.9) cityname += this.assets.randomChoice(suffixes)
            return cityname
        }

        cityInfo() {
            return "Welcome to "+this.name+", population: "+this.population.toString();
        }

        draw() {
            // Simple z-ordering, just draw mobs behind structures but on top of the ground
            this.map.drawGround();
            for (var i = 0; i < this.mobs.length; i++) { 
                this.mobs[i].draw();
            }
            this.map.drawStructures();
            if (this.alienRobot) {
                this.alienRobot.draw();
            }
        }

        stepAI() {
            this.map.placeSomething()
        }

        spawnMob() {
            if (this.mobs.length >= this.maxMobCount)  {
                console.log("Tried to spawn a mob but too many onscreen already");
                return;
            }
            if (this.map.structureCount < 2)  {
                console.log("Tried to spawn a mob but not enough structures onscreen");
                return;
            }
            var mob = new this.Mob(this);
            console.log("Made mob:", mob)
            this.mobs.push(mob);
        }

        spawnAlien() {
            var target = [0,0];
            var targetOK = false;
            var badloop = 0;
            // Do we already have an alien?
            if (this.alienRobot) {
                return;
            }
            // Do we have enough structures?
            if (this.map.structureCount < 1)  {
                console.log("Tried to spawn an alien robot but not enough structures onscreen");
                return;
            }
            // Cycle to ensure that chosen structure makes alien robot onscreen
            while (!targetOK) {
                // If we can't identify a structure in a good position, return
                badloop += 1
                if (badloop > 1000) {
                    console.log("Tried to spawn an alien robot but couldn't find structure in a good place");
                    return;
                }
                target = this.map.randomStructure();
                let isAlreadyPresent = this.map.grid[target[0]][target[1]] == this.assets.present;
                // Check target
                if ((target[1] >= 4) && (!isAlreadyPresent)) {
                    targetOK = true;
                }
            }
            console.log("Spawning alien robot");
            this.alienRobot = new this.AlienRobot(this,target);
        }

        despawnAlien() {
            console.log("Despawning alien robot");
            this.alienRobot = null;
        }

        despawnMob(mob) {
            const index = this.mobs.indexOf(mob);
            if (index > -1) {
                this.mobs.splice(index, 1);
            }
        }

        moveMobs() {
            for (var i = 0; i < this.mobs.length; i++) { 
                this.mobs[i].move();
            }
            if (this.alienRobot) {
                this.alienRobot.move()
            }
        }

        // -------------------------------------------------------------------------------
        Mob = class {
            constructor(city) {
                this.city = city;
                this.day = city.day;
                this.assets = city.assets;
                this.map = city.map;
                this.position = this.spawn();
                // Grid cell size in screen units
                this.gridw = width/this.map.nx;
                this.gridh = height/this.map.ny;
                // Sprite can be mostly empty but is size of grid tile to make things easy
                this.imw = this.gridw;
                this.imh = this.gridw;
                this.waypoints = this.makeWaypoints();
                this.waypoint = 0;
                this.waypointProgress = 0.0;
                this.pathLength = 0;
                this.speed = 0.1 + 0.2*Math.random();
                this.sprite = this.assets.randomChoice(this.assets.mobs);
            }

            spawn() {
                console.log("Spawned mob")
                return this.map.randomStructure()
            }

            despawn() {
                console.log("Despawned mob")
                this.city.despawnMob(this);
            }

            makeWaypoints() {
                // Makes waypoints in screen space, converting from grid space
                // Also add some noise to make things more interesting
                var path = this.makeGridPath() 
                var waypoints = []
                var g = this.gridw;
                var x = 0;
                var y = 0;
                waypoints.push([(path[0][0]+0.5)*g,(path[0][1]+0.5)*g]);
                for (var i = 0; i < path.length-1; i++) {  
                    x = g*(path[i][0] + 0.25 + 0.5*Math.random());
                    y = g*(path[i][1] + 0.25 + 0.5*Math.random());
                    waypoints.push([x,y]);
                }
                waypoints.push([(path[path.length-1][0]+0.5)*g,(path[path.length-1][1]+0.5)*g]);
                this.position = waypoints[0];
                return waypoints;
            }

            makeGridPath() {
                // Make a path on the grid itself
                // Set up
                var destination = this.map.randomStructure(this.position);
                var droadObj = this.map.distanceToRoad(this.position[0],this.position[1]);
                var distanceToRoad = droadObj[0];
                var nearestRoadToStart = droadObj[1];
                var nearestRoadToEnd = null;
                var distanceToTarget = this.map.distanceBetween(this.position,destination);
                console.log("Making waypoints between:", this.position, destination)
                if (distanceToTarget < distanceToRoad) {
                    // Simplest case - target is nearer than a road so just two waypoints
                    return [this.position,destination]
                } else {
                    nearestRoadToEnd = this.map.distanceToRoad(destination[0],destination[1])[1];
                    // Less simple: find path along roads
                    var roadPath = this.map.roadPathSearch(nearestRoadToStart,nearestRoadToEnd);
                    var newpath = [];
                    newpath.push(this.position);
                    for (var ip = 0; ip < roadPath.length; ip++) {
                        newpath.push(roadPath[ip]);
                    }
                    newpath.push(destination);
                    console.log("New path:", newpath);
                    return newpath;
                }

            }

            euclidDistance(pointA,pointB) {
                // Distinguishes from the NYC distance used elsewhere
                return Math.sqrt((pointA[0]-pointB[0])**2 + (pointA[1]-pointB[1])**2);
            }

            move() {
                // Move the mob along a path
                var currposwp = this.waypoints[this.waypoint];
                var nextposwp = this.waypoints[this.waypoint+1];
                // Need to recalculate the path length to the next waypoint?
                if (this.pathLength == 0) {
                    this.pathlength = this.euclidDistance(currposwp,nextposwp);
                }
                // Get fractional progress along path
                this.waypointProgress += this.speed*0.001*deltaTime/this.pathlength;
                // Are we at the next waypoint?
                if (this.waypointProgress >= 1.0) {
                    // Don't bother cycling, just set to next waypoint
                    this.waypointProgress = 0.0;
                    this.waypoint += 1;
                    this.position = nextposwp;
                    this.pathLength = 0;
                } else {
                    // Calculate position as fractional progress along path
                    this.position[0] = currposwp[0] + (nextposwp[0] - currposwp[0])*this.waypointProgress;
                    this.position[1] = currposwp[1] + (nextposwp[1] - currposwp[1])*this.waypointProgress;
                }
                // Check for last waypoint
                if (this.waypoint == (this.waypoints.length-1)) {
                    this.despawn()
                }
            }

            draw() {
                if (this.day.DEBUG) {
                    var w = this.waypoints;
                    // If debug, display mob paths       
                    for (var i = 0; i < w.length-1; i++) {  
                        line(w[i][0],w[i][1],
                            w[i+1][0],w[i+1][1]);
                    }
                }
                // Draw mob
                // Centre sprite on position
                var x = this.position[0]-0.5*this.gridw;
                var y = this.position[1]-0.5*this.gridh;
                image(this.assets.sprite(this.sprite), x, y, this.imw, this.imh);
            }
        }

        // -------------------------------------------------------------------------------
        AlienRobot = class {
            constructor(city, target) {
                this.city = city;
                this.map = city.map;
                this.day = city.day;
                this.assets = city.assets;
                this.target = target;
                this.gridw = this.map.gridw;
                this.gridh = this.map.gridh;
                // Put teleporter above the target
                this.teleportPosition = [this.target[0],this.target[1]-1];
                // Put self above that
                // Self is 2x the size of a regular grid cell, and we need to centre it
                this.position = [this.target[0]-0.5,this.target[1]-3];
                this.floating = [0.0,0.0]
                this.teleportOn = false;
                this.age = 0;
                this.maxAge = 10000;
            }

            move() {
                // Check maximum age
                this.age += deltaTime;
                if (this.age > 0.9*this.maxAge) {
                    // Set alien target to present
                    this.map.grid[this.target[0]][this.target[1]] = this.assets.present;
                }
                if (this.age > this.maxAge) {
                    this.city.despawnAlien();
                }
                // Artificial low frame rate
                var frameTime = 200; // 200 ms = 0.2 s
                // Set floating offset
                this.floating[1] = 0.05*Math.sin(0.001*frameTime*int(this.age/frameTime));
                // Set teleporter Flicker
                this.teleportOn = (this.age % (2*frameTime) > frameTime);
            }

            draw() {
                // Alien
                image(this.assets.sprite(this.assets.alien), 
                    (this.position[0]+this.floating[0])*this.gridw, 
                    (this.position[1]+this.floating[1])*this.gridh, 
                    2*this.gridw, 2*this.gridh);
                // Teleporter
                if (this.teleportOn) {
                    image(this.assets.sprite(this.assets.teleport), 
                        this.teleportPosition[0]*this.gridw, 
                        this.teleportPosition[1]*this.gridh, 
                        this.gridw, this.gridh);
                }
                
            }
        }

        // -------------------------------------------------------------------------------
        Map = class {
            constructor(city) {
                this.city = city;
                this.day = city.day;
                this.assets = city.assets;
                this.nx = 21;
                this.ny = 21;
                 // The border is really just a hack to simplify array search
                this.border = 1;
                this.grid = [];
                this.spriteCounter = {}
                this.roadCount = 0;
                this.structureCount = 0;
                this.maxRoadFraction = 0.2;
                this.roadRollChance = 1.0;
                this.roadRollDecay = 0.3;
                this.roadRollIncrease = 1.2;
                this.monumentMax = 4;
                this.atRoadLimit = false;
                this.makeLeftRoad = Math.random() < 0.5;
                this.mapFullFraction = 0.45
                this.fullMap = false;
                this.noRoads = true;
                this.treeFraction = 0.05+Math.random() * 0.2;
                // Used to search for random structures easily
                this.structurePositions = [];
                this.gridw = width/this.nx;
                this.gridh = height/this.ny;
                // Make map
                for (var ix = 0; ix < this.nx; ix++) { 
                    this.grid[ix] = [];
                    for (var iy = 0; iy < this.ny; iy++) {
                        this.grid[ix][iy] = 0;
                    }
                }
                var b = this.border;
                for (var ix = b; ix < this.nx-b; ix++) { 
                    for (var iy = b; iy < this.ny-b; iy++) {
                        if (Math.random() < this.treeFraction) {
                            this.grid[ix][iy] = this.assets.randomChoice(this.assets.trees)
                        }
                    }
                }
            }
    
            drawGround() {
                var spriteID;
                var x, y;
                var imw = this.gridw;
                var imh = this.gridh;
                for (var ix = 0; ix < this.nx; ix++) { 
                    for (var iy = 0; iy < this.ny; iy++) {
                        spriteID = this.grid[ix][iy];
                        x = imw*ix;
                        y = imh*iy;
                        // Draw an empty snowfield if either empty or structure
                        if (spriteID >= 0) image(this.assets.sprite(0), x, y, imw, imh);
                        // Draw road
                        if (spriteID < 0) {
                            image(this.assets.sprite(spriteID), x, y, imw, imh);
                        }

                    }
                }
            }

            drawStructures() {
                var spriteID;
                var x, y;
                var imw = this.gridw;
                var imh = this.gridh;
                for (var ix = 0; ix < this.nx; ix++) { 
                    for (var iy = 0; iy < this.ny; iy++) {
                        spriteID = this.grid[ix][iy];
                        x = imw*ix;
                        y = imh*iy;
                        // Draw any structures
                        if (spriteID > 0) {
                            image(this.assets.sprite(spriteID), x, y, imw, imh);
                        }

                    }
                }
            }

            checkMapFull() {
                if (this.fullMap) return true;
                // Check if map is full
                var itemCount = 0;
                for (var ix = 0; ix < this.nx; ix++) { 
                    for (var iy = 0; iy < this.ny; iy++) {
                        if (!(this.isEmpty(ix,iy))) {
                            itemCount += 1;
                        }
                    }
                }
                if (itemCount >= this.mapFullFraction * this.nx * this.ny) {
                    console.log("Map full, not placing anything else"); 
                    this.fullMap = true;
                }
                return this.fullMap;
            }

            placeSomething() {
                // Don't place something if the map is full
                if (this.fullMap) {  
                    return;
                }
                var placedSomething = false;
                var b = this.border;
                if (!this.atRoadLimit) {
                    console.log("Road chance now:", this.roadRollChance)
                } else {
                    console.log("At road limit, no more roads")
                }
                var doRoad = ((Math.random() < this.roadRollChance) && (!this.atRoadLimit));
                var loopChecker = 0;
                while (!placedSomething) {
                    var ix = int(Math.random()*(this.nx-b-1))+b;
                    var iy = int(Math.random()*(this.ny-b-1))+b;
                    // Place road
                    if (doRoad) {
                        // Juice the road placement to avoid parallel roads
                        if (ix % 2 == 0) continue;
                        if (iy % 2 == 0) continue;
                        // Place on an existing road to prevent disconnected roads
                        if (!this.isRoad(ix,iy) && !this.noRoads) continue;
                        placedSomething = this.placeRoad(ix, iy);
                    }
                    // Place structure
                    else {
                        // Cycle if no roads within 4 cells
                        // distanceToRoad also returns the position of the nearest road
                        // but we don't need that here
                        if (this.distanceToRoad(ix,iy)[0] > 4) continue;
                        placedSomething = this.placeStructure(ix, iy);
                    }
                    // Prevent bad loops, just exit if this happens
                    loopChecker += 1;
                    if (loopChecker > 1000) break;
                }
                // Check if map full for next placement
                this.checkMapFull();

            }

            isEmpty(ix,iy) {
                var isEmpty = this.grid[ix][iy] == 0;
                var isTree = this.assets.trees.includes(this.grid[ix][iy]);
                return isEmpty || isTree;
            }

            isRoad(ix,iy) {
                return this.grid[ix][iy] < 0;
            }

            isStructure(ix,iy) {
                var isStructure = this.grid[ix][iy] > 0;
                var isTree = this.assets.trees.includes(this.grid[ix][iy]);
                return isStructure && !isTree;
            }

            alignRoads() {
                var b = this.border;
                var goesUp = false;
                var goesLeft = false;
                var dx = 0;
                var dy = 0;
                // Search every road cell for neighbouring roads to align the sprites
                for (var ix = b; ix < this.nx-b; ix++) { 
                    for (var iy = b; iy < this.ny-b; iy++) {
                        if (this.isRoad(ix,iy)) {
                            goesLeft = (this.isRoad(ix-1,iy) || this.isRoad(ix+1,iy));
                            goesUp   = (this.isRoad(ix,iy-1) || this.isRoad(ix,iy+1));
                            if (goesLeft && goesUp) {
                                this.grid[ix][iy] = this.assets.crossroad;
                            } else if (goesUp) {
                                this.grid[ix][iy] = this.assets.uproad;
                            } else {
                                this.grid[ix][iy] = this.assets.leftroad;
                            }
                        }
                    }
                }

            }

            placeRoad(pix, piy) {
                // This will place roads in a straight line until they hit something
                // Direction is chosen randomly internally
                console.log("Placing road at", pix, piy);
                if (this.isStructure(pix,piy)) {
                    return false;
                }
                // Generate roads updown and leftright interchangably
                var leftright = this.makeLeftRoad;
                this.makeLeftRoad = !this.makeLeftRoad;
                var stopMinus = false;
                var stopPlus = false;
                var b = this.border;
                if (leftright) {
                    // Do minus direction
                    for (var i = pix; i >= b; i--) { 
                        if (this.isStructure(i,piy)) break;
                        this.grid[i][piy] = -1;
                    }
                    // Do plus direction
                    for (var i = pix+1; i < this.nx-b; i++) { 
                        if (this.isStructure(i,piy)) break;
                        this.grid[i][piy] = -1;
                    }
                }
                else{
                    // Do minus direction
                    for (var i = piy; i >= b; i--) { 
                        if (this.isStructure(pix,i)) break;
                        this.grid[pix][i] = -1;
                    }
                    // Do plus direction
                    for (var i = piy+1; i < this.ny-b; i++) { 
                        if (this.isStructure(pix,i)) break;
                        this.grid[pix][i] = -1;
                    }
                }
                this.roadCount = 0;
                for (var ix = 0; ix < this.nx; ix++) { 
                    for (var iy = 0; iy < this.ny; iy++) {
                        if (!(this.isEmpty(ix,iy))) {
                            this.roadCount += 1;
                        }
                    }
                }
                // Now do a pass and check for neighbouring roads to align them properly
                this.alignRoads();
                // Check road limit and stop building roads if over it
                if (this.roadCount >= this.maxRoadFraction*this.nx*this.ny) {
                    this.atRoadLimit = true;
                }
                // Now make it more likely to make a structure
                this.roadRollChance *= this.roadRollDecay;
                this.noRoads = false;
                return true;
            }

            placeStructure(pix,piy) {
                // Place a structure randomly
                console.log("Placing structure at", pix, piy);
                if (!this.isEmpty(pix,piy)) {
                    return false;
                }
                var structure = this.generateStructure();
                // Count number of structures
                if (!(structure in this.spriteCounter)) {
                    this.spriteCounter[structure] = 0; 
                }
                // Check structure generation is OK
                if (!this.checkStructure(pix,piy,structure)) {
                    return false;
                }
                // Add sprite
                this.spriteCounter[structure] += 1;
                this.structureCount += 1;
                this.grid[pix][piy] = structure;
                this.structurePositions.push([pix,piy]);
                // Now make it more likely to make a road
                this.roadRollChance *= this.roadRollIncrease;
                this.roadRollChance = Math.min(1.0,this.roadRollChance);
                // Add city population
                this.city.population += int(Math.random()*4)+1;
                return true;

            }

            randomStructure(notThisOne=null) {
                // Error state if no structures
                if (this.structureCount == 0) {
                    return [-1,-1]; 
                }
                // Return a random structure
                var choice = this.assets.randomChoice(this.structurePositions);
                if (!notThisOne) {
                    return choice;
                } else {
                    // Make sure the choice isn't notThisOne
                    // Used to make sure a destination isn't the current position
                    while (choice == notThisOne) {
                        choice = this.assets.randomChoice(this.structurePositions);
                    }
                }
                return choice;

            }

            generateStructure() {
                var houses = this.assets.houses;
                var choice = Math.random();
                if (choice < 0.1) return this.generateMonument();
                return this.assets.randomChoice(houses);
            }

            generateMonument() {
                return this.assets.randomChoice(this.assets.monuments)
            }

            checkStructure(pix,piy,structure) {
                // Space monuments out a bit and make sure there aren't too many
                if (this.assets.monuments.includes(structure)) {
                    var distanceOK = true;
                    if (this.spriteCounter[structure] > 0) {
                        var distanceOK = this.distanceToStructure(pix, piy, structure) >= 5;
                    }
                    var countOK = this.spriteCounter[structure] < this.monumentMax;
                    return (distanceOK && countOK)
                }
                // Otherwise OK
                return true;
            }

            distanceToRoad(pix, piy) {
                var distance = 10000;
                // Use NYC distance (dx + dy)
                var b = this.border;
                var closestRoad = null;
                var newdist = 0;
                for (var ix = b; ix < this.nx-b; ix++) { 
                    for (var iy = b; iy < this.ny-b; iy++) {
                        if (this.isRoad(ix,iy)) {
                            newdist = Math.abs(pix-ix)+Math.abs(piy-iy)
                            if (newdist < distance) {
                                distance = newdist;
                                closestRoad = [ix,iy]
                            }
                        }
                    }
                }
                return [distance,closestRoad];
            }

            distanceToStructure(pix, piy, spriteID) {
                var distance = 10000;
                var b = this.border;
                for (var ix = b; ix < this.nx-b; ix++) { 
                    for (var iy = b; iy < this.ny-b; iy++) {
                        if (this.grid[ix][iy] == spriteID) {
                            // SHOULD DO THE SAME AS BELOW, KEPT TO AVOID TOO MUCH INDIRECTION
                            distance = Math.min(Math.abs(pix-ix)+Math.abs(piy-iy),distance);
                        }
                    }
                }
                return distance;
            }

            distanceBetween(pointA,pointB) {
                // Calculate NYC distance (dx + dy)
                return Math.abs(pointA[0]-pointB[0])+Math.abs(pointA[1]-pointB[1])
            }

            isSamePoint(pointA,pointB) {
                // Calculate NYC distance (dx + dy)
                return (pointA[0] == pointB[0]) && (pointA[1] == pointB[1])
            }

            findNodesInRoads(start,end) {
                // Find nodes in roads in Cartesian axes
                var startx = start[0];
                var starty = start[1];
                var nodes = []
                var crossroad = this.assets.crossroad;

                // Search x axis
                var b = this.border;
                for (var ix = b; ix < this.nx-b; ix++) { 
                    // Just go to end
                    if (end[0] == ix && end[1] == starty) {
                        nodes = [end];
                        return nodes;
                    }
                    // Find all nodes in the row
                    if (this.grid[ix][starty] == crossroad) {
                        nodes.push([ix,starty]);
                    }
                }
                // Search y axis
                for (var iy = b; iy < this.ny-b; iy++) {
                    // Just go to end
                    if (end[0] == startx && end[1] == iy) {
                        nodes = [end];
                        return nodes;
                    }
                    // Find all nodes in the column
                    if (this.grid[startx][iy] == crossroad) {
                        nodes.push([startx,iy]);
                    }
                }
                return nodes;

            }

            copyPath(path) {
                var newpath = []
                for (var i = 0; i < path.length; i++) {
                    newpath.push(path[i]);
                }
                return newpath;
            }
                
            roadPathSearch(start,end) {
                // Loop over paths
                var path = null;
                var nodes = null;
                var paths = [[start]];
                var newpath = null;
                var newpaths = [];
                var MAXRECURSIONS = 100;
                for (var irecursion = 0; irecursion < MAXRECURSIONS; irecursion++) {
                    for (var ip = 0; ip < paths.length; ip++) { 
                        path = paths[ip];
                        // Check if we're done already
                        if (this.isSamePoint(path.at(-1),end)) {
                            return path;
                        }
                        // Fill in new nodes to make new paths
                        nodes = this.findNodesInRoads(path[path.length-1],end);
                        for (var i = 0; i < nodes.length; i++) { 
                            // Don't make backtracking paths
                            if (!path.includes(nodes[i])) {
                                newpath = this.copyPath(path);
                                newpath.push(nodes[i]);
                                // Check if we're done
                                if (this.isSamePoint(newpath.at(-1),end)) {
                                    return newpath;
                                }
                                newpaths.push(newpath) 
                            }
                        }

                    }
                    // Set up next recursion
                    paths = newpaths;
                }
                // If we reach here, the recursions have failed to find a path
                console.log("Failed to find path in roadPathSearch");
                return false;
            }
        }

    }


}


