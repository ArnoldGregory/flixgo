// Dummy movie data using real cover paths
const dummyMovies = [
	{ Id: 1, Title: "I Dream in Another Language", Description: "Demo description A.", PosterUrl: "img/covers/cover.jpg", MovieUrl: "#", Genres: ["Action","Trailer"], Rating: 8.4 },
	{ Id: 2, Title: "Benched", Description: "Demo description B.", PosterUrl: "img/covers/cover2.jpg", MovieUrl: "#", Genres: ["Comedy"], Rating: 7.1 },
	{ Id: 3, Title: "Whitney", Description: "Demo description C.", PosterUrl: "img/covers/cover3.jpg", MovieUrl: "#", Genres: ["Romance","Drama"], Rating: 6.3 },
	{ Id: 4, Title: "Blindspotting", Description: "Demo description D.", PosterUrl: "img/covers/cover4.jpg", MovieUrl: "#", Genres: ["Comedy","Drama"], Rating: 7.9 },
	{ Id: 5, Title: "I Dream (alt)", Description: "Demo description E.", PosterUrl: "img/covers/cover5.jpg", MovieUrl: "#", Genres: ["Action"], Rating: 8.1 },
	{ Id: 6, Title: "Benched 2", Description: "Demo description F.", PosterUrl: "img/covers/cover6.jpg", MovieUrl: "#", Genres: ["Comedy"], Rating: 7.0 }
];

// Card HTML for carousel
function homeItemHTML(m) {
	return `
	<div class="item">
		<div class="card card--big">
			<div class="card__cover">
				<img src="${m.PosterUrl}" alt="${m.Title}">
				<a href="details1.html?id=${m.Id}" class="card__play"><i class="icon ion-ios-play"></i></a>
			</div>
			<div class="card__content">
				<h3 class="card__title"><a href="details1.html?id=${m.Id}">${m.Title}</a></h3>
				<span class="card__category">${m.Genres.map(g=>`<a href="#">${g}</a>`).join(' ')}</span>
				<span class="card__rate"><i class="icon ion-ios-star"></i>${m.Rating}</span>
			</div>
		</div>
	</div>`;
}

// Populate carousel
(function insertCarousel(){
	const $home = $('.home__carousel');
	if ($home.length) {
		$home.empty();
		dummyMovies.forEach(m => $home.append(homeItemHTML(m)));

		$home.owlCarousel({
			items: 4,
			loop: true,
			margin: 30,
			nav: false,
			dots: false
		});

		$('#carousel-next').on('click', () => $home.trigger('next.owl.carousel', [4]));
		$('#carousel-prev').on('click', () => $home.trigger('prev.owl.carousel', [4]));
	}
})();

// Three.js Poster Wall
(function loadThree(){
	function initWhenReady(){
		if (window.THREE) {
			initThreeWall('#three-root', dummyMovies);
		} else {
			const s = document.createElement('script');
			s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r152/three.min.js';
			s.onload = () => initThreeWall('#three-root', dummyMovies);
			document.head.appendChild(s);
		}
	}
	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initWhenReady);
	else initWhenReady();
})();

function initThreeWall(selector, movies) {
	const root = document.querySelector(selector);
	if (!root) return;

	const width = root.clientWidth || window.innerWidth;
	const height = root.clientHeight || 360;
	const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setSize(width, height);
	root.appendChild(renderer.domElement);

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
	camera.position.z = 12;

	const ambient = new THREE.AmbientLight(0xffffff, 1.0);
	scene.add(ambient);

	const group = new THREE.Group();
	scene.add(group);

	const cols = Math.min(6, movies.length);
	const rows = Math.ceil(movies.length / cols);
	const spacingX = 3.6;
	const spacingY = 5.2;
	const startX = -((cols - 1) * spacingX) / 2;
	const startY = ((rows - 1) * spacingY) / 2;

	const loader = new THREE.TextureLoader();
	const meshToId = new Map();

	movies.forEach((m, i) => {
		const col = i % cols;
		const row = Math.floor(i / cols);
		const x = startX + col * spacingX;
		const y = startY - row * spacingY;

		const geometry = new THREE.PlaneGeometry(2.6, 3.9);
		const mat = new THREE.MeshBasicMaterial({ color: 0x333333 });
		const plane = new THREE.Mesh(geometry, mat);
		plane.position.set(x, y, 0);
		group.add(plane);
		meshToId.set(plane.uuid, m.Id);

		loader.load(m.PosterUrl, texture => {
			plane.material.map = texture;
			plane.material.needsUpdate = true;
		});
	});

	let angle = 0;
	function animate(){
		requestAnimationFrame(animate);
		angle += 0.003;
		group.rotation.y = Math.sin(angle) * 0.08;
		renderer.render(scene, camera);
	}
	animate();

	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();
	function onPointerDown(event){
		const rect = renderer.domElement.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		const y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;
		mouse.set(x, y);
		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObjects(Array.from(group.children));
		if (intersects.length) {
			const hit = intersects[0].object;
			const id = meshToId.get(hit.uuid);
			if (id) window.location.href = `details1.html?id=${id}`;
		}
	}
	renderer.domElement.addEventListener('pointerdown', onPointerDown);

	window.addEventListener('resize', function(){
		const w = root.clientWidth || window.innerWidth;
		const h = root.clientHeight || 360;
		renderer.setSize(w, h);
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
	});
}
