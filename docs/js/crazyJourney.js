var jsonDBs = [
  {"url": "https://jsonbox.io/GLoBaLCHaNGePoSTeReXPLoReR/" },  // https://github.com/vasanthv/jsonbox#readme
  {"url": "https://jsonbase.com/GLoBaLCHaNGePoSTeReXPLoReR/" }

// https://jsonstorage.net/

];

function getJsonDb() {
 return jsonDBs[0].url;
}

var corsProxies = [
  {"url": "https://cors-anywhere.herokuapp.com/", "p": 0.4, "content": null},      // 200 in 60 min 
  {"url": "https://api.allorigins.win/get?url=", "p": 0.6, "content": "contents"}  // goes into contents:
 // NOT WORKING
 // "https://cors-proxy.htmldriven.com/?url=", // 404
 // "https://thingproxy.freeboard.io/fetch/", // ??
 // "http://www.whateverorigin.org/get?url=", // https needed
 // "http://alloworigin.com/get?url=", // https needed
 // "https://yacdn.org/proxy/"  // <uri>?maxAge=10  bad gateway
];

// geo&ip:  https://stackoverflow.com/questions/391979/how-to-get-clients-ip-address-using-javascript
// ip:      https://ourcodeworld.com/articles/read/257/how-to-get-the-client-ip-address-with-javascript-only

function getRandomProxy() {
  var randomFloat = Math.random();
  var proxy = null
  for (var i = 0; i < corsProxies.length; i++ ) {  
    proxy = corsProxies[i];
    randomFloat -= proxy.p;
    if(randomFloat < 0.0) {
      return proxy.url;
    }
  }
  return proxy.url;
}

var makeCRCTable = function(){
    var c;
    var crcTable = [];
    for(var n =0; n < 256; n++){
        c = n;
        for(var k =0; k < 8; k++){
            c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
    return crcTable;
}

var crc32 = function(str) {
    var crcTable = window.crcTable || (window.crcTable = makeCRCTable());
    var crc = 0 ^ (-1);

    for (var i = 0; i < str.length; i++ ) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
    }

    return (crc ^ (-1)) >>> 0;
};

function getFingerprint(days=5.0, delta=0.0) {
  var navigator_info = window.navigator;
  var screen_info = window.screen;
  var uid = navigator_info.mimeTypes.length;
  var dateTs = Date.now() - 1000*60*60*24*delta;           // i.e. 2 days
  var dateTs = Math.round(dateTs/(1000*60*60*24*days));    // i.e. 4 days
  uid += navigator_info.userAgent.replace(/\D+/g, '');
  uid += navigator_info.plugins.length;                   // plugins: name,version
  uid += screen_info.height || '';
  uid += screen_info.width || '';
  uid += screen_info.pixelDepth || '';
  uid += dateTs.toString();
  return crc32(uid);
}

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

function checkUrlSubString(str) {
  return (location.href.indexOf(str) != -1);
}

function isoStr(str) {
   if (!str) return '';
   str = str.replace(' ','_');
   str = str.replace('ß','ss');
   str = str.replace('ü','ue');
   return str.toLowerCase();
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
  return array;
}

function transparentize(color, opacity) {
  var alpha = opacity === undefined ? 0.5 : 1 - opacity;
  return Color(color).alpha(alpha).rgbString();
}


function findGetParameter(parameterName) {
  var result = null,
      tmp = [];
  var items = location.search.substr(1).split("&");
  for (var index = 0; index < items.length; index++) {
      tmp = items[index].split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
  }
  return result;
}

function findHashParameter(parameterName) {
  var result = null,
      tmp = [];
  var items = location.hash.substr(1).split("&");
  for (var index = 0; index < items.length; index++) {
      tmp = items[index].split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
  }
  return result;
}


var langs = navigator.languages;
var lang = navigator.language || navigator.userLanguage;
var lang2 = findHashParameter('lang');
var abc = 1;

// may add candidate list
function findPreferedLanguage() {
  var candidates = ['de','en'];
  var langHash = findHashParameter('lang');
  if(langHash && candidates.includes(langHash)) {
    return langHash;
  }
  var langGet = findGetParameter('lang');
  if(langGet && candidates.includes(langGet)) {
    return langGet;
  }
  var langNavi = navigator.language || navigator.userLanguage;
  if(langNavi && candidates.includes(langNavi.substr(0,2))) {
    return langNavi.substr(0,2);
  }
  if(navigator.languages) {
    for(var j=0; j<navigator.languages.length; j++) {
        var langList = navigator.languages[j].substr(0,2);
        if(langList && candidates.includes(langList)) {
          return langList;
        }
    }
  }    
  return candidates[0];
}

var i18n = new VueI18n({ locale: findPreferedLanguage(), messages: {en: {}, de: {} }});

var vueGCPE = new Vue({
  i18n: { locale: findPreferedLanguage(), messages: {en: {}, de: {} }},
  el: '#crazyJourney', 
  data: {
        uid: '0',
        uidOld: '0',
        //posterIds: [],
        allPosterData: [],    
        selectedPosterData: [],
        currentPosterData: null, 
        allPosterContinents: [],
        allPosterCountries: [],
        allPosterLandscapes: [],
        allPosterTopics: [],
        allPosterMethods: [],
        allMethods : [],
        allTableRows : [],
        allTopics2 : [],
        allLandscapes : [],
        allContinents : [],   
        allCountries : [],              
        allPosterYears: [],
        currentPage: "all",
        filterLocation: "Alle",
        filterLandscape: "Alle",
        filterTopic: "Alle",
        filterMethod: "Alle",
        filterYear: "Alle",
        konamiFnc: null,
        isBusy: false,
        tilesView: null,
        active: false,
        show: false,
        //currentLanguage: "de",
        //languageMessages: {en: {}, de: {}}
        myPositionLevel: 0,
        myTableRow: { 
                    id:"0", year:"2022", freidok:'', issue:"0", doi:'', language:'en', orientation:'landscape',
                    title:'', abstract:'', 
                    authors: [{email:'', firstname:'', name:'', freidok:'', orcid:''}],
                    location: {country:null, countries:['None'], continent:'Welt', landscape:'Großstadt', latitude:-41.0, longitude:-150.0, city:'', region:''}, 
                    concept:'Diskursanalyse', topic:'Klimawandel', subtopic:'Erwärmung', 
                    period: {begin:1950, end:2022}, keywords:[], 
                    pdf:'',  thumbnail:'', icon:'', tiles:null,
                    sources:[]
                  },
  },
  methods: {
     toggleModal() {
      const body = document.querySelector("body");
      this.active = !this.active;
      //this.$refs.modalClose.$el.focus();
      this.active
        ? body.classList.add("modal-open")
        : body.classList.remove("modal-open");
      setTimeout(() => (this.show = !this.show), 10);
     },
     setPage: function(page) {
        this.currentPage = page;
        return false; 
     },
     checkPage: function(page) {
       return ((this.currentPage == page) || (this.currentPage == "all"));  
     },
     checkFilter: function() {
      return ((this.currentPage == "gallery") || (this.currentPage == "map") || (this.currentPage == "all"));  
    },     
     setLanguage: function(language) {
      //this.currentLanguage = language;
      this.$i18n.locale = language;
      this.myPoster.language = language;
      return false; 
     },
     checkLanguage: function(language) {
       return (this.$i18n.locale == language);
     },
     resetPosters: function() { 
       this.allPosterData = [];
       this.allPosterContinents = [];
       this.allPosterCountries = [];
       this.allPosterLandscapes = [];
       this.allPosterTopics = [];
       this.allPosterMethods = [];
       this.allPosterYears = [];
     }, 
     checkPoster: function(posterId) {
        return(this.currentPosterData.id == posterId);
     },
     selectPoster: function(poster) {
        this.currentPosterData = poster;
     },
     addPoster: function(json) { 
        // Vue.set(this.allPosterData2, json.id, json); 
        this.allPosterData.push(json);
        this.selectedPosterData.push(json);
        if(!this.currentPosterData) {
          this.currentPosterData = json;
        }
        if (typeof initMap === 'function') {
          addPosterMarkers([json]);
        }
        if(json.location.continent && !this.allPosterContinents.includes(json.location.continent)) {
          this.allPosterContinents.push(json.location.continent);
          this.allPosterContinents.sort();
        }
        if(json.location.country && !this.allPosterCountries.includes(json.location.country)) {
          this.allPosterCountries.push(json.location.country);
          this.allPosterCountries.sort();
        }
        if(json.location.countries) {
          for(var j=0; j<json.location.countries.length; j++) {
            var country = json.location.countries[j]; 
            if(country && !this.allPosterCountries.includes(country)) {
              this.allPosterCountries.push(country);
              this.allPosterCountries.sort();
            }
          }
        }
        if(json.location.landscape && !this.allPosterLandscapes.includes(json.location.landscape)) {
          this.allPosterLandscapes.push(json.location.landscape);
          this.allPosterLandscapes.sort();
        }
        if(json.topic && !this.allPosterTopics.includes(json.topic)) {
          this.allPosterTopics.push(json.topic);
          this.allPosterTopics.sort();
        }
        if(json.subtopic && !this.allPosterTopics.includes(json.subtopic)) {
          this.allPosterTopics.push(json.subtopic);
          this.allPosterTopics.sort();
        }
        if(json.concept && !this.allPosterMethods.includes(json.concept)) {
          this.allPosterMethods.push(json.concept);
          this.allPosterMethods.sort();
        }
        if(json.year && !this.allPosterYears.includes(json.year.toString())) {
          this.allPosterYears.push(json.year.toString());
          this.allPosterYears.sort();
          this.allPosterYears.reverse();
        }
     },
/*
     updatePoster: function(data) {
         var dbPostUrl = getJsonDb()+"poster";
         data.count += 1;
         var delta = (data.ts - Date.now())/(1000*60*60*24*90);  // 3 month
         data.value *= Math.exp(delta)
         data.value += 1.0;
         data.ts = Date.now();
         axios
          .post(dbPostUrl, data)
          .catch(function (error) {
             console.log(error);
           });
     },
     removeUpdatePoster: function (data) {
         var dbDelUrl = getJsonDb()+"poster?q=id:"+data.id;
         axios
           .delete(dbDelUrl)
           .catch(function (error) {
              console.log(error);
           })
           .then(response => { 
              this.updatePoster(data);
           }); 
     },
     getRemoveUpdatePoster: function (id) {
       var dbUrl = getJsonDb()+"poster?q=id:"+id;
       axios
         .get(dbUrl)
         .catch(error => {
              console.log(error);
              this.updatePoster({"id": id, "count": 0, "value": 0.0, "ts": Date.now()});
           })
         .then(response => { 
            if(response.data.length > 0) {
               this.removeUpdatePoster(response.data[0]);
            } else {
              this.updatePoster({"id": id, "count": 0, "value": 0.0, "ts": Date.now()});
            }
       });

     },
*/
     openPoster: function (id, event) {
       //this.getRemoveUpdatePoster(id);
       if(this.tilesView) {
         for(var j=0; j<this.allPosterData.length; j++) {
           var poster = this.allPosterData[j]; 
           if(poster.id == id) {
             if(poster.tiles) {
               this.currentPosterData = poster;
               this.tilesView.world.removeAll();
               this.tilesView.addTiledImage({tileSource:poster.tiles});
               this.toggleModal();
               if (event) { event.preventDefault(); }  
               return false;
             } else {
               return true;
             }
           }
         } 
       }       
       return true;
     },
     inqCountries: function () {
       var volumesUrl = "https://globalchanges.github.io/PosterExplorer/meta/countries.json";
       axios
         .get(volumesUrl)
         .then(response => { 
            this.setCountries(response.data);
       });
     },
     awesome: function (str) {
      // if(!this.allTopics2) {return 'question'; }  // is remembered... 
      var c = this.allTopics2[str];
      return c ? c.awesome : str;
      //return c ? c.awesome : 'question';
    },
     mapicon: function (str) {
       var cou = this.allCountries[str]
       var con = this.allContinents[str]
       return cou ? cou.map : con ? con.map : 'wrld';
     }, 
     findGnd: function (str) {
       var c = this.allTopics[str];
       if(c) {return c.gnd ? c.gnd : '?';}
       c = this.allMethods[str];
       if(c) {return c.gnd ? c.gnd : '?';}
       c = this.allLandscapes[str];
       if(c) {return c.gnd ? c.gnd : '?';}
       c = this.allContinents[str];
       if(c) {return c.gnd ? c.gnd : '?';}
       c = this.allCountries[str];
       if(c) {return c.gnd ? c.gnd : '?';}       
       return '?';
     },
     findDdc: function (str) {
      var c = this.allContinents[str];
      if(c) {return c.ddc ? c.ddc : '?';}
      return '?';
    },
     inqTopics: function () {
       var volumesUrl = "https://globalchanges.github.io/PosterExplorer/meta/topics.json";
       axios
         .get(volumesUrl)
         .then(response => { 
            this.setTopics(response.data);
       });
     },
     inqMethods: function () {
       var volumesUrl = "https://globalchanges.github.io/PosterExplorer/meta/concepts.json";
       axios
         .get(volumesUrl)
         .then(response => { 
            this.setMethods(response.data);
       });
     },
     inqLandscapes: function () {
       var volumesUrl = "https://globalchanges.github.io/PosterExplorer/meta/landscapes.json";
       axios
         .get(volumesUrl)
         .then(response => { 
            this.setLandscapes(response.data);
       });
     },
     inqContinents: function () {
      var volumesUrl = "https://globalchanges.github.io/PosterExplorer/meta/continents.json";
      axios
        .get(volumesUrl)
        .then(response => { 
           this.setContinents(response.data);
      });
    },     
    inqCountries: function () {
      var volumesUrl = "https://globalchanges.github.io/PosterExplorer/meta/countries.json";
      axios
        .get(volumesUrl)
        .then(response => { 
           this.setCountries(response.data);
      });
    },       
     inqOthers: function () {
       var volumesUrl = "https://globalchanges.github.io/PosterExplorer/meta/others.json";
       axios
         .get(volumesUrl)
         .then(response => { 
            this.setOthers(response.data);
       });
     },

     inqTopics2: function () {
       var volumesUrl = "https://globalchanges.github.io/PosterExplorer/meta/topics2.json";
       axios
         .get(volumesUrl)
         .then(response => { 
            this.setTopics2(response.data);
       });
     },

     inqTable: function () {
       //var csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSFhYEda6xqhNTlUM2PlR6U4uAmH_wBJR9WqaZtEHWhEui9gVcNmXyJucyRuWIhziPqdgusrjOimFrc/pub?output=csv";
       this.clearTableRows();

       if (typeof initMap === 'function') {
         clearPosterMarkers();
       }

       Papa.parse(csvUrl, {
                    download: true,
                    header: true,
                    skipEmptyLines: true,
                    complete: function (answer) {
                        console.log("Ho");
                        for (i=0; i<answer.data.length; i++) {
                            console.log(answer.data[i]);
                            //csvData.push(answer.data[i]);
                            this.addTableRow(answer.data[i]);

                            if (typeof initMap === 'function') {
                              addPosterMarkers(answer.data[i]);
                            }

                        }
                        //console.log(csvData);
                    }
                });
     },
     clearTableRows: function() { this.allTableRows = []; },
     addTableRow: function(data) { this.allTableRows.push(data); },
     setTopics: function(data) { this.allTopics = data; },
     setMyTopic: function(topic) { this.myPoster.topic = topic; },
     setMySubtopic: function(subtopic) { this.myPoster.subtopic = subtopic; },
     setMethods: function(data) { this.allMethods = data; },
     setMyMethod: function(method) { this.myPoster.concept = method; },
     setLandscapes: function(data) { this.allLandscapes = data; },
     setMyLandscape: function(landscape) { this.myPoster.location.landscape = landscape; },
     setContinents: function(data) { this.allContinents = data; },
     setMyContinent: function(continent) { 
       this.myPoster.location.continent = continent; 
       // (this.myLocationLevel < 1.5) 
       this.setMyCoordinates(continent, this.allContinents, false, 20);
       this.myLocationLevel = Math.max(this.myLocationLevel,1);
      },
     setCountries: function(data) { this.allCountries = data; },
     setMyCountry: function(country, index) { 
        Vue.set(this.myPoster.location.countries, index, country); 
        this.myPoster.location.country = country; //todo: if length = 1, else null...
        this.setMyCoordinates(country, this.allCountries, true, 2);
        //  (this.myLocationLevel < 2.5) 
        if(this.myPoster.location.country == 'None') {
          this.setMyCoordinates(continent, this.allContinents, true, 20);
          this.myLocationLevel = Math.max(this.myLocationLevel,2);
        }
     },  
     checkDistance(lat1,long1,lat2,long2,maxDistance) {
       distance = 0.0
       distance += Math.pow((lat1-lat2),2);
       distance += Math.pow((lat1-lat2),2);
       return(distance<Math.pow(maxDistance,2))
     },   
     setMyCoordinates(location, locations, forced, distance) {
      var newLatitude = this.myPoster.location.latitude;
      var newLongitude = this.myPoster.location.longitude; 
      for (var key in locations) {
        // check if the property/key is defined in the object itself, not in parent
        if (locations.hasOwnProperty(key) && (key == location)) {           
          object = locations[key];
          if(object.hasOwnProperty('latitude')) {
            newLatitude = object['latitude'];
          }
          if(object.hasOwnProperty('longitude')) {
            newLongitude = object['longitude'];
          }
        }
      }
      // TODO: check if initial coordinates or forced
      if(forced || 
           this.checkDistance(this.myPoster.location.latitude,this.myPoster.location.longitude,-41.0,-150.0,0.01) ||
          !this.checkDistance(this.myPoster.location.latitude,this.myPoster.location.longitude,newLatitude,newLongitude,distance)
          ) {
          this.myPoster.location.latitude = newLatitude + distance*0.2*(Math.random()-0.5);
          this.myPoster.location.longitude = newLongitude + distance*0.2*(Math.random()-0.5);
      }
     },
     setOthers: function(data) { this.allOthers = data; },
     setTopics2: function(data) { this.allTopics2 = data; },
     setMyLanguage: function(language) { this.myPoster.language = language; },
     setMyOrientation: function(orientation) { this.myPoster.orientation = orientation; },
     inqFolders: function() {
       var foldersUrl = "https://globalchanges.github.io/PosterExplorer/meta/folders.json";
       axios
         .get(foldersUrl)
         .then(response => { 
            var dirs = response.data;
            this.resetPosters();
            for(var j=0; j<dirs.length; j++) {
              var subdir = dirs[j]; 
              this.inqIds(subdir);
            }
       });
     }, 


     inqLocale: function(language) {
       var languageUrl = "https://globalchanges.github.io/PosterExplorer/meta/locale-"+language+".json";
       axios
         .get(languageUrl, {params: {language: language}})
         .then(response => { 
            var locale = response.data;
            var language = response.config.params.language;
            this.addLocale(language, locale);
         });
     },
     addLocale: function(language, locale) {
      //languageMessages[language] = locale;  //better merge
      //this.$i18n.setLocaleMessage(language, locale);
      this.$i18n.mergeLocaleMessage(language, locale);
     },
     setLocationFilter: function(location) {
       this.isBusy = true;
       this.filterLocation = location;
      //this.filterPosterData();
      setTimeout(() => {this.filterPosterData();}, 200);
     },
     setLandscapeFilter: function(landscape) {
       this.isBusy = true; 
       this.filterLandscape = landscape;
       //this.filterPosterData();
       setTimeout(() => {this.filterPosterData();}, 200);
     },
     setTopicFilter: function(topic) {
       this.isBusy = true;
       this.filterTopic = topic;
       //this.filterPosterData();
       setTimeout(() => {this.filterPosterData();}, 200);
     },
     setMethodFilter: function(method) {
       this.isBusy = true;
       this.filterMethod = method;
       //this.filterPosterData();
       setTimeout(() => {this.filterPosterData();}, 200);
     },
     setYearFilter: function(year) {
       this.isBusy = true;
       this.filterYear = year;
       //this.filterPosterData();
       setTimeout(() => {this.filterPosterData();}, 200);
     },
    filterPosterData: function() {
       this.isBusy = true;
       var result = [];
       for(var j=0; j<this.allPosterData.length; j++) {
          var poster = this.allPosterData[j]; 
          var locationFound =  ((this.filterLocation == 'Alle') || 
                                (this.filterLocation == poster.location.continent) ||
                                (this.filterLocation == poster.location.country) ||
                                (poster.location.countries && poster.location.countries.includes(this.filterLocation))
                               );
          var landscapeFound =  ((this.filterLandscape == 'Alle') || 
                                (this.filterLandscape == poster.location.landscape));
          var topicFound =  ((this.filterTopic == 'Alle') || 
                                (this.filterTopic == poster.topic) ||
                                (this.filterTopic == poster.subtopic));
          var methodFound =  ((this.filterMethod == 'Alle') || 
                                (this.filterMethod == poster.concept));
          var yearFound =  ((this.filterYear == 'Alle') || 
                                (this.filterYear == poster.year.toString()));
          if(locationFound && landscapeFound && topicFound && methodFound && yearFound) {
            result.push(poster);
          }
       }
       shuffle(result)
       this.selectedPosterData = shuffle(result);
       if (typeof initMap === 'function') {
         clearPosterMarkers();
         addPosterMarkers(result);
       }
       //this.isBusy = false;
       setTimeout(() => {this.isBusy = false;}, 100);
    },

    checkMap: function() {
       if(isMapReady()) {
         this.setPage('gallery');
       } else {
         window.setTimeout(this.checkMap, 200);
       }
    },

  },
  computed: {


  },
  filters: {
    lowercase: function (str) {
      return isoStr(str);
    },
    shorting: function (str) {
      if(str.length > 715) {
        str = str.substr(0, 710)+' ...';
      }
      return str;
    },
  },
  mounted () { 
     //this.checkMap();
     //this.initSeadragon();
     this.inqTable();
  },
  created () {
     this.inqLocale('de');
     this.inqLocale('en'); 
     //this.myJourney.language = this.$i18n.locale;    
     this.inqTable();

     
     this.initTs = Date.now();
     this.uid = getFingerprint(4.0, 0.0);
     this.uidOld = getFingerprint(4.0, 2.0);
     this.konamiFnc = new Konami(() => this.inqHidden());

  }
}) 
