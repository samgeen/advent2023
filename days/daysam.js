// Made by Firstname Lastname (keep this line and replace with your name)

function dayXPreload() {

    // Load any assets here (with assets.dayX at the front of the variable name)
    assets.daySam = new DaySamAssets();
    console.log("Loaded DayX");
}

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
        this.tickerText = "";
        this.city = 0;
        this.loading = false;
        this.loadingReady = false;
        // Set to false to run with launcher and music
        this.DEBUG = true;
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
            var minAIDelay = 2000;
            var maxAIDelay = 8000;
            var minTickerDelay = 7000;
            var maxTickerDelay = 10000;
            this.aiDelay += deltaTime;
            this.tickerDelay += deltaTime;
            if (this.aiDelay > this.nextAIDelay) {
                this.city.stepAI();
                this.aiDelay = 0;
                this.nextAIDelay = (maxAIDelay-minAIDelay)*Math.random()+minAIDelay;
            }
            if (this.tickerDelay > this.nextTickerDelay) {
                this.generateTickerText();
                this.tickerDelay = 0;
                this.tickerLifetime = this.maxTickerLifetime;
                this.nextTickerDelay = (maxTickerDelay-minTickerDelay)*Math.random()+minTickerDelay;
            }
            // Draw city
            this.city.draw();
        }
        // Draw UI
        this.drawui();
    }

    drawInfo() {
        fill(215,123,186);
        textFont(this.assets.font);
        textAlign(LEFT, TOP);
        rectMode(CENTER);
        var fsizesmall = 20;
        textSize(fsizesmall);
        var textMusic = "Turn music on: M"
        if (this.assets.musicOn) {
            textMusic = "Turn music off: M";
        }
        text(textMusic, 10,10);
    }

    drawui () {
        // Draw info
        this.drawInfo()
        // Draw news ticker
        this.drawNewsTicker()
        // Draw city info
        this.drawCityInfo()
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
                    "New winter trend: having a nice time in the snow"];
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
                                "My Christmas tree caught fire :( Thanks fire service :)",
                                "Come check out my snowman! Mayor! Come check it out!",
                                "You have won a million lollipops! Click here to claim",
                                "Thanks for the cycle-friendly infrastructure, mayor! NOT",
                                "I lost my dog. Can you help look for her? Her name is Biffles",
                                "My sibling is visiting town - can they crash at the Mayor's House for a bit?",
                                "Wow! The lights are amazing! Thanks, Mayor!",
                                "I broke the ice for the ducks - they seem to be having fun now",
                                "Singing Christmas songs to the old folks until they chase me out",
                                "Oh wassail oh wassail all over the town, the roads they are pink and the reindeer poop's brown",
                                "Old man was stuck on my roof - says his sleigh went off without him",
                                "Thanks for the new tree, Mayor! Looks fancy in the town square",
                                "You know what pastry tastes the freshest? Mints pies! I said, mints pies! MINTS P-"];
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

    }

    City = class {

        constructor(day) {
            this.day = day;
            this.assets = day.assets;
            this.map = new this.Map(this);
            this.name = this.makeName()
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
            this.map.draw();
        }

        stepAI() {
            this.map.placeSomething()
        }

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
    
            draw() {
                var spriteID;
                var x, y, imw, imh;
                for (var ix = 0; ix < this.nx; ix++) { 
                    for (var iy = 0; iy < this.ny; iy++) {
                        spriteID = this.grid[ix][iy];
                        imw = width/this.nx;
                        imh = height/this.ny;
                        x = imw*ix;
                        y = imh*iy;
                        // Draw an empty snowfield if either empty or structure
                        if (spriteID >= 0) image(this.assets.sprite(0), x, y, imw, imh);
                        // Draw snow behind sprites
                        if (spriteID != 0) {
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
                        if (this.distanceToRoad(ix,iy) > 4) continue;
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
                this.spriteCounter[structure] += 1
                this.grid[pix][piy] = structure;
                // Now make it more likely to make a road
                this.roadRollChance *= this.roadRollIncrease;
                this.roadRollChance = Math.min(1.0,this.roadRollChance);
                // Add city population
                this.city.population += int(Math.random()*4)+1
                return true;

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
                for (var ix = b; ix < this.nx-b; ix++) { 
                    for (var iy = b; iy < this.ny-b; iy++) {
                        if (this.isRoad(ix,iy)) {
                            distance = Math.min(Math.abs(pix-ix)+Math.abs(piy-iy),distance);
                        }
                    }
                }
                return distance;
            }

            distanceToStructure(pix, piy, spriteID) {
                var distance = 10000;
                // Use NYC distance (dx + dy)
                var b = this.border;
                for (var ix = b; ix < this.nx-b; ix++) { 
                    for (var iy = b; iy < this.ny-b; iy++) {
                        if (this.grid[ix][iy] == spriteID) {
                            distance = Math.min(Math.abs(pix-ix)+Math.abs(piy-iy),distance);
                        }
                    }
                }
                return distance;
            }
        }

    }

    // Below is the basic setup for a nested class. This can be deleted or renamed

    HelperClass = class {

        constructor() {

        }
    }
}