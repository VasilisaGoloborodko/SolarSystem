// cleaning console

console.clear();
var scene, sceneInfo, camera, cameraInfo, renderer, raycaster, controls;
var container = document.getElementById('container');
var raycaster = new THREE.Raycaster(),INTERSECTED;
var mouse = new THREE.Vector2();
var check_focus = 0;
var angleDelta = []; //дельта угла для каждой планеты
var asteroids;
var quaternion = new THREE.Quaternion();
const axis = new THREE.Vector3(0, 1, 0).normalize();
var renderManager;
var planetSceneInfo;
var eventsText = '';

var planetsInfo = 
  {
   sun: {texture: "https://preview.ibb.co/gADrB7/sol.jpg",
         position: 0,
         name: 'Солнце',
         size: 25,
         speed: 0,
         weight: "1989000.00000 · 1024 кг",
         distance: '-',
         speedInfo: '-',
         info: "<p>Солнце является единственной звездой в Солнечной системе, вокруг нее совершают свое движение все планеты системы, а также их спутники и другие объекты, вплоть до космической пыли. Если сравнить массу Солнца с массой всей Солнечной системы, то она составит порядка 99,866 процентов.</p><p>Солнце является одной из 100 000 000 000 звезд нашей Галактики и по величине стоит среди них на четвертом месте. Ближайшая к Солнцу звезда Проксима Центавра располагается на расстоянии четырех световых лет от Земли. От Солнца до планеты Земля 149,6 млн км, свет от звезды доходит за восемь минут. От центра Млечного пути звезда находится на расстоянии 26 тысяч световых лет, при этом она производит вращение вокруг него со скоростью 1 оборот в 200 миллионов лет.</p><p>По спектральной классификации звезда относится к типу «желтый карлик», по приблизительным расчетам ее возраст составляет чуть более 4,5 миллиардов лет, она находится в середине своего жизненного цикла.</p>"
        },
   mercury: {texture: "https://preview.ibb.co/g8ZpjS/mercurio.jpg",
             position: -40,
             name: "Меркурий",
             size: 1,
             speed: 0.01,
             weight: '0.32868 · 1024 кг',
             distance: '57,9 млн.км',
             speedInfo: '47,9 км/с',
             info: "<p>Меркурий – первая планета от Солнца. Совершает обороты по эллиптической орбите с удаленностью в 46-70 млн. км. На один орбитальный пролет тратит 88 дней, а на осевой – 59 дней. Из-за медлительного вращения день охватывает 176 дней. Осевой наклон крайне незначителен.</p><p>При диаметре в 4887 км первая планета от Солнца достигает 5% земной массы. Поверхностная гравитация – 1/3 земной. Планета практически лишена атмосферного слоя, поэтому днем раскалена, а ночью замерзает. Температурная отметка колеблется между +430°C и -180°C.</p><p>Есть кратерная поверхность и железное ядро. Но по магнитному полю уступает земному. Изначально радары указывали на наличие водяного льда на полюсах. Аппарат Messenger подтвердил предположения и нашел залежи на дне кратеров, которые все время погружены в тень.</p><p>Первая планета от Солнца расположена близко к звезде, поэтому её можно заметить перед рассветом и сразу после заката.</p>"
            },
   venus: {texture: "https://preview.ibb.co/i1uE17/venus.jpg",
           position: 50,
           name: "Венера",
           size: 2,
           speed: 0.0073,
           weight: '4.81068 · 1024 кг',
           distance: '108,2 млн.км',
           speedInfo: '35,0 км/с',
           info: "<p>Венера – вторая планета от Солнца. Путешествует по практически круговой орбите на дистанции в 108 млн. км. Ближе всех подходит к Земле и может сокращать расстояние до 40 млн. км.</p><p>На орбитальный путь тратит 225 дней, а осевой оборот (по часовой стрелке) длится 243 дней. День охватывает 117 земных дней. Осевой наклон составляет 3 градуса.</p><p>По диаметру (12100 км) вторая планета от Солнца почти сходится с земным и достигает 80% земной массы. Показатель гравитации – 90% земной. У планеты наблюдается плотный атмосферный слой, где давление в 90 раз превышает земное. Атмосфера наполнена двуокисью углерода с толстыми серными облаками, что создает мощный парниковый эффект. Именно из-за этого поверхность прогревается на 460°C (наиболее раскаленная планета в системе).</p><p>Поверхность второй планеты от Солнца скрыта от прямого наблюдения, но ученым удалось создать карту при помощи радара. Укрыта крупными вулканическими равнинами с двумя огромными континентами, горами и долинами. Есть и ударные кратеры. Наблюдается слабое магнитное поле.</p>"
          },
   earth: {texture: "https://preview.ibb.co/fwZWg7/tierra4.jpg",
           position: -60,
           name: "Земля",
           size: 2,
           speed: 0.0062,
           weight: '5.97600 · 1024 кг',
           distance: '149,6 млн.км',
           speedInfo: '29,8 км/с', 
           info: "<p>Земля - третья планета от Сплнца. Это крупнейшая и самая плотная из внутренних планет. Орбитальный путь отдален от Солнца на 150 млн. км. Обладает единственным спутником и развитой жизнью.</p><p>На орбитальный облет уходит 365.25 дней, а осевое вращение занимает 23 часа, 56 минут и 4 секунды. Продолжительность дня – 24 часа. Осевой наклон составляет 23.4 градуса, а показатель диаметра – 12742 км.</p><p>Третья планета от Солнца сформировалась 4.54 млрд. лет назад и большую часть ее существования рядом находится Луна. Полагают что спутник появился после того, как в Землю врезался огромный объект и вырвал материал на орбиту. Именно Луна стабилизировала земной осевой наклон и выступает источником формирования приливов.</p><p>Спутник в диаметре охватывает 3747 км (27% от земного) и расположен на удаленности в 362000-405000 км. Испытывает планетарное гравитационное воздействие, из-за чего замедлил осевое вращение и попал в гравитационный блок (поэтому к Земле повернута одна сторона).</p><p>Планета защищена от звездной радиации мощным магнитным полем, сформированным активным ядром (расплавленное железо).</p>"
          },
   marth: {texture: "https://preview.ibb.co/gQLOB7/marte.jpg",
           position: 70,
           name: "Марс",
           size: 1,
           speed: 0.005,
           weight: '0.63345 · 1024 кг',
           distance: '227,9 млн.км',
           speedInfo: '24,1 км/с',
           info: "<p>Марс - четвертая планета от Солнца. Красная планета перемещается по эксцентричному орбитальному пути – 230 млн. км. На один облет вокруг Солнца тратит 686 дней, а осевой оборот – 24 часа и 37 минут. Расположен под наклоном в 25.1 градус, а день длится 24 часа и 39 минут. По наклону напоминает Землю, поэтому располагает сезонами.</p><p>По диаметру четвертая планета от Солнца (6792 км) вдвое меньше земного, а масса достигает 1/10 земной. Показатель гравитации – 37%.</p><p>Марс лишен защиты в качестве магнитного поля, поэтому изначальная атмосфера уничтожилась солнечным ветром. Аппараты зафиксировали отток атомов в пространство. В итоге, давление достигает 1% земного, а тонкий атмосферный слой представлен 95% углекислого газа.</p><p>Четвертая планета от Солнца крайне морозная, где температура опускается зимой до -87°C, а летом поднимается к -5°C. Это пыльное местечко с гигантскими бурями, способными охватить всю поверхность.</p>"
          },
   jupiter: {texture: "https://preview.ibb.co/hAAjJn/jupiter.jpg",
             position: -100,
             name: "Юпитер",
             size: 10,
             speed: 0.0027,
             weight: '1876.64328 · 1024 кг',
             distance: '778,6 млн.км',
             speedInfo: '13,1 км/с',
             info: "<p>Юпитер – пятая планета от Солнца. Кроме того, перед вами крупнейшая планета в системе, которая в 2.5 раз массивнее всех планет и охватывает 1/1000 солнечной массы.</p><p>Отдален от Солнца на 780 млн. км и тратит на орбитальный путь 12 лет. Наполнен водородом (75%) и гелием (24%) и может располагать скалистым ядром, погруженным в жидкий металлический водород с диаметром в 110000 км. Общий планетарный диаметр – 142984 км.</p><p>В верхнем атмосферном слое расположены 50-километровые облака, представленные кристаллами аммиака. Они находятся в полосах, перемещающихся на разных скоростях и широтах. Примечательным кажется Большое Красное Пятно – масштабный шторм.</p><p>На осевой оборот пятая планета от Солнца тратит 10 часов. Это стремительная скорость, а значит экваториальный диаметр на 9000 км больше полярного.</p>"
            },
   saturn: {texture: "https://image.ibb.co/j2r8dn/Saturn.jpg",
            position: 125,
            name: "Сатурн",
            size: 9,
            speed: 0.002,
            weight: '561.80376 · 1024 кг',
            distance: '1 433,7 млн.км',
            speedInfo: '9,6 км/с',
            info: "<p>Сатурн - шестая планета от Солнца. Сатурн стоит на 2-й позиции по масштабности в системе, превосходя земной радиус в 9 раз (57000 км) и в 95 раз массивнее.</p><p>Отдален от Солнца на 1400 млн. км и тратит на орбитальный пролет 29 лет. Наполнен водородом (96%) и гелием (3%). Может располагать скалистым ядром в жидком металлическом водороде с диаметром в 56000 км. Верхние слои представлены жидкой водой, водородом, гидросульфидом аммония и гелием.</p><p>Ядро раскалено до 11700°C и производит больше тепла, чем планета получает от Солнца. Чем выше поднимаемся, тем ниже падает градус. На верхушке температура удерживается на отметке в -180°C и 0°C на глубине в 350 км.</p><p>Облачные слои шестой планеты от Солнца напоминают картину Юпитера, но они слабее и шире. Есть также Большое Белое Пятно – краткая периодическая буря. На осевой оборот тратит 10 часов и 39 минут, но точную цифру назвать сложно, так как нет фиксируемых поверхностных особенностей.</p>"
           },
   uran: {texture: "https://preview.ibb.co/kthWyn/uranus.jpg",
          position: -155,
          name: "Уран",
          size: 9,
          speed: 0.0014, 
          weight: '86.05440 · 1024 кг',
          distance: '2 870,4 млн.км',
          speedInfo: '6,8 км/с',
          info: "<p>Уран - седьмая планета от Солнца. Уран – представитель ледяных гигантов и стоит на 3-й позиции по величине в системе. По диаметру (50000 км) в 4 раза превосходит земной и в 14 раз массивнее.</p><p>Отдален на 2900 млн. км и тратит на орбитальный путь 84 года. Удивляет то, что по осевому наклону (97 градусов) планета буквально вращается на боку.</p><p>Полагают, что присутствует небольшое скалистое ядро, вокруг которого сконцентрирована мантия из воды, аммиака и метана. Далее следует водородная, гелиевая и метановая атмосфера. Седьмая планета от Солнца выделяется еще тем, что не излучает больше внутреннего тепла, поэтому температурная отметка опускается к -224°C (самая морозная планета).</p>"
         },
    neptun: {texture: "https://preview.ibb.co/cZ1DB7/Neptune.jpg",
             position: 180,
             name: "Нептун",
             size: 9,
             speed: 0.001,
             weight: '101.59200 · 1024 кг',
             distance: '4491,1 млн.км',
             speedInfo: '4,8 км/с',
             info: "<p>Нептун - восьмая планета от Солнца. Нептун с 2006 года считается официальной последней планетой в Солнечной системе. Диаметр – 49000 км, а по массивности в 17 раз превышает земную.</p><p>Отдален на 4500 млн. км и тратит на орбитальный пролет 165 лет. Из-за удаленности к планете поступает лишь 1% солнечного освещения (по сравнению с Землей). Осевой наклон – 28 градусов, а оборот выполняет за 16 часов.</p><p>Метеорология восьмой планеты от Солнца более выражена, чем у Урана, поэтому на полюсах можно заметить мощные штормовые действия в виде темных пятен. Ветер разгоняется до 600 м/с, а температурная отметка падает к -220°C. Ядро прогревается до 5200°C.</p>"
            }
  };

//массив с данными для спутников
//amount - количество спутников для каждой планеты
var asterData = 
    {
      sun: {position: []},
      mercury: {position: []},
      venus: {position: []},
      earth: {position: [50]},
      marth: {position: [20, 60]},
      jupiter: { position: [30, 40, 90, 120]},
      saturn: {position: [50, 70, 90, 110, 150]},
      uran: {position: [40, 45, 60, 80, 110]},
      neptun: {position: [40, 60, 110]}
    };

var events = [
  ['Полное солнечное затмение', '2019-06-02'],
  ['Кольцевое солнечное затмение', '2019-12-26']
];

function init(){
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  
  document.body.appendChild( renderer.domElement );
  
  //>>>>>>>>>>>>>>// RENDER MANAGER
				
	renderManager = new THREE.Extras.RenderManager(renderer);

  //background
  var texture_bg = new THREE.TextureLoader().load( "https://preview.ibb.co/kKzqic/space.jpg" );
  
  //СЦЕНА 1
  scene = new THREE.Scene();
  scene.background = texture_bg;
  
  //камера
  camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.2, 10000);
  camera.position.set(0, 200, 500);
  scene.add(camera);
      
    // controls
	controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.minDistance = 50;
	controls.maxDistance = 1000;
  
  //освещение
  light = new THREE.PointLight(0xffffff, 1);
  light.position.set(-1, 0, 0);
  scene.add(light); 
  
  // оси
  var axes = new THREE.AxesHelper( 20 );
  scene.add(axes);
  
  createPlanets();
  
  renderManager.add('sceneMain', scene, camera, function(delta, renderer)
  {   
    if(check_focus == 0){
      var par = Object.getOwnPropertyNames( planetsInfo );
      for (var i = 0, l = this.objects.planet.children.length; i < l; i++) {
        // поворот вокруг оси глобальной оси y
        rotateAroundWorldAxis(this.objects.planet.children[i], new THREE.Vector3(0,1,0), angleDelta[i]);
    } 
      renderer.render(this.scene, this.camera);
  } 
  },
  {
    planet: planets
  });
  
  //СЦЕНА 2
  sceneInfo = new THREE.Scene();
  sceneInfo.background = texture_bg;
  
  //камера для сцены2
  cameraInfo = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.2, 10000);
  cameraInfo.position.z = 500;
  sceneInfo.add(cameraInfo);
  
  // controls
	controls = new THREE.OrbitControls( cameraInfo, renderer.domElement );
  controls.minDistance = 50;
	controls.maxDistance = 1000;
  
  //освещение
  var light = new THREE.AmbientLight( 0xFFFFFF, 1 );
  sceneInfo.add( light );
    
  renderManager.add('sceneInfo', sceneInfo, cameraInfo, function(delta, renderer)
  {
    quaternion.setFromAxisAngle(axis, 0.03);
    for(var i = 0, l = this.scene.children.length; i < l; i++){
      this.scene.children[i].position.applyQuaternion(quaternion);
    }
    renderer.render(this.scene, this.camera);
  });
    
  //слушатели 
  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('mousedown', onDocumentMouseDown, false);

  
  planetSceneInfo = new THREE.Object3D();
  sceneInfo.add(planetSceneInfo); 
};

//общий конструктор для создания планеты
function planet(plName, array, check_flag, arrayInfo, size){
  var constr = planetsInfo[plName];
  
  var loader = new THREE.TextureLoader().load(constr.texture)  
  var geometry = new THREE.SphereGeometry(size, 32, 32);
  
  if(check_flag == 1){
    var positionPl = constr.position;
    angleDelta.push(constr.speed);
  }
  else{
    var positionPl = 0;
  }
   
  //солнце создаем отдельно другим материалом, так как его не нужно освещать
  if((plName == "sun") || (check_flag == 0)){
    var material = new THREE.MeshBasicMaterial( {map: loader} );
  }
  else{
    var material = new THREE.MeshLambertMaterial( {map: loader} );
  }
  
  var newPlanet = new THREE.Mesh( geometry, material );
  newPlanet.position.x = positionPl;
  newPlanet.name = constr.name;
  
  array.add( newPlanet );
    
  //кольцо для Сатурна
  if(plName == "saturn"){
     if (check_flag == 1){
       var material = new THREE.MeshLambertMaterial( { color: 0xC0C0C0, side: THREE.DoubleSide } );   
       var geometry = new THREE.RingGeometry( 10, 11, 32 );
       angleDelta.push(constr.speed);
     }
     else{
       var material = new THREE.MeshBasicMaterial( { color: 0xC0C0C0, side: THREE.DoubleSide } );
        var geometry = new THREE.RingGeometry( 30, 32, 32 );
     }
     satCircle = new THREE.Mesh( geometry, material );
     satCircle.position.set(positionPl, 0,0);
     satCircle.rotation.y = Math.PI/8;
     satCircle.rotation.x = Math.PI/2;
     array.add( satCircle ); 
   }
  }

//функция создания орбит
function orbita(type, name, curscene, number){
  
  if( typeof(type[name].position) == "object"){
    var constr = type[name].position[number];
  }
  else{
    var constr = type[name].position;
  }

   //орбиты
   var curve = new THREE.EllipseCurve(
	   0,  0,            // ax, aY
	   constr, constr,           // xRadius, yRadius
	   0,  2 * Math.PI,  // aStartAngle, aEndAngle
	   false,            // aClockwise
	   0                 // aRotation
   );
     
   var points = curve.getPoints( 50 );
   var geometry = new THREE.BufferGeometry().setFromPoints( points );
   var material = new THREE.LineBasicMaterial( { color : 0x404040 } );

   // Create the final object to add to the scene
   var ellipse = new THREE.Line( geometry, material );
   ellipse.rotation.x = Math.PI/2;
   curscene.add(ellipse);
}

//функция создания планет
function createPlanets(){
  planets = new THREE.Object3D();  
  var par = Object.getOwnPropertyNames( planetsInfo );
  for (var i = 0, l = par.length; i < l; i++){
    var constr = new planet(par[i], planets, 1, planetsInfo, planetsInfo[par[i]].size);
    var orb = new orbita(planetsInfo, par[i], scene, 0);
  }
  scene.add(planets);  
};

//функция слушателя изменения размера экрана
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    cameraInfo.aspect = window.innerWidth / window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.updateProjectionMatrix();
    cameraInfo.updateProjectionMatrix();
};

function animate(){
  requestAnimationFrame( animate );
  controls.update();
  renderManager.renderCurrent(); 
}


function render() {
  renderManager.renderCurrent();
};


function onDocumentMouseDown(event){
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  if(check_focus == 0){
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(planets.children);
    if(intersects.length > 0){
      var par = Object.getOwnPropertyNames( planetsInfo );
      for (var i = 0, l = par.length; i < l; i++) {
        if( planetsInfo[par[i]].name == intersects[0].object.name){
          var constr = new planet(par[i], sceneInfo, 0, asterData, 25);
          createAster(par[i]);
          document.getElementById("name").textContent = planetsInfo[par[i]].name;
          document.getElementById("weight").textContent = planetsInfo[par[i]].weight;
          document.getElementById('speed').textContent =  planetsInfo[par[i]].speedInfo;
          document.getElementById("distance").textContent = planetsInfo[par[i]].distance;
          document.getElementById('asters').textContent = asterData[par[i]].position.length;
          document.getElementById('info').innerHTML = planetsInfo[par[i]].info;
        }
       }
       cameraInfo.position.set(0, 200, 500);
       renderManager.setCurrent('sceneInfo');
    
       document.getElementById("menu").style.display = "block";
       document.getElementById("button").style.display = "none";
    
       check_focus = 1;
     }
    }
  else{
    document.getElementById("button").style.display = "block";
    raycaster.setFromCamera(mouse, cameraInfo);
    var intersects = raycaster.intersectObjects(planets.children);
    if(intersects.length == 0){
      document.getElementById("menu").style.display = "none";
      camera.position.set(0, 200, 500);
      renderManager.setCurrent('sceneMain');
      check_focus = 0;
    
      var allChildren = sceneInfo.children;
      var length = allChildren.length;
      while (sceneInfo.children.length > 0){
        for (var j = 0; j < sceneInfo.children.length; j++) {
          sceneInfo.remove(allChildren[j]);
        } 
      }
    }
  } 
}

function createAster(planetName){

  var sphere;
  var asterAmount = asterData[planetName].position.length;
  if (asterAmount > 0){
  
    var geometry = new THREE.SphereGeometry(3, 32, 32);
    var material = new THREE.MeshBasicMaterial( {color: 0x404040} );
    for (var i = 0, l = asterAmount; i < l; i++) {
      sphere = new THREE.Mesh( geometry, material );
      sphere.position.x = asterData[planetName].position[i];
      sceneInfo.add( sphere );    
      var orb = new orbita(asterData, planetName, sceneInfo, i);
    }
  }
}

var rotateAroundWorldAxis = function(object, axis, radians) {
        var rotWorldMatrix = new THREE.Matrix4();
        rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
        var currentPos = new THREE.Vector4(object.position.x, object.position.y, object.position.z, 1);
        var newPos = currentPos.applyMatrix4(rotWorldMatrix);
        rotWorldMatrix.multiply(object.matrix);
        object.matrix = rotWorldMatrix;
        object.rotation.setFromRotationMatrix(object.matrix);
        object.position.x = newPos.x;
        object.position.y = newPos.y;
        object.position.z = newPos.z;
  };

function show(state){
  document.getElementById('forecastWnd').style.display = state;	
  eventsText = "";
  addForecast();
}

function addForecast(){
  var deadline = 0;
  for(var i = 0, l = events.length; i < l; i++){
    deadline = events[i][1];
    initializeClock('timer', deadline, events[i][0]);
   }
  document.getElementById('timer').innerHTML = eventsText;
}

function initializeClock(id, endtime, name){
  var clock = document.getElementById(id);
  var timerSpan = clock.querySelector('timer');
  function updateClock(){
    var t = getTimeRemaining(endtime);
    
    if((t.days % 10 == 1)&&(t.days != 11)){
      eventsText = eventsText + "<tr><td><div class='forecast'><div>" + name + "</div><div>Осталось: " + t.days + " день ";
    }
    else if((t.days % 10 == 2)||(t.days % 10 == 3)||(t.days % 10 == 4)){
      if((t.days == 12)||(t.days == 13)||(t.days == 14)){
        eventsText = eventsText + "<tr><td><div class='forecast'><div>" + name + "</div><div>Осталось: " + t.days + " дней ";
      }
      else{
        eventsText = eventsText + "<tr><td><div class='forecast'><div>" + name + "</div><div>Осталось: " + t.days + " дня ";
      }
    }
    else{
      eventsText = eventsText + "<tr><td><div class='forecast'><div>" + name + "</div><div>Осталось: " + t.days + " дней ";
    }
    
    if((t.hours % 10 == 1)&&(t.hours !== 11)){
      eventsText = eventsText + t.hours + " час</div></div></td></tr>"; 
    }
    else if(t.hours % 10 == 2|3|4){
      if(t.hours == 12|13|14){
        eventsText = eventsText + t.hours + " часов</div></div></td></tr>";
      }
      else{
         eventsText = eventsText + t.hours + " часа</div></div></td></tr>";
      }
    }
    else{
      eventsText = eventsText + t.hours + " часов</div></div></td></tr>";
    }
    
    if(t.total<=0){
      clearInterval(timeinterval);
    }
   }

updateClock(); // запустите функцию один раз, чтобы избежать задержки
var timeinterval = setInterval(updateClock,1000);
}

function getTimeRemaining(endtime){
  var t = Date.parse(endtime) - Date.parse(new Date());
  var hours = Math.floor( (t/(1000*60*60)) % 24 );
  var days = Math.floor( t/(1000*60*60*24) );
  return {
   'total': t,
   'days': days,
   'hours': hours
  };
}

init();
animate();
