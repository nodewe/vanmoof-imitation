class BrakeBanner {
	constructor(selector) {
		this.app = new PIXI.Application({
			//canvas 容器的宽度
			width: window.innerWidth,
			// canvas容器的高度
			height: window.innerHeight,
			// canvas 的背景
			backgroundColor: 0xffffff,
			// 变化
			resizeTo: window
		});
		document.querySelector(selector)
			.appendChild(this.app.view);

		this.stage = this.app.stage;
		this.speed = 0;
		//使用加载器
		this.loader = new PIXI.Loader();
		//加载资源
		this.addResource()
		// 加载
		this.loader.load();
		// 添加一个侦听器 资源加载完成的回调函数
		this.loader.onComplete.add(this.show.bind(this))
	}
	//添加所有的资源
	addResource() {
		const resources = [
			'btn.png',
			'btn_circle.png',
			'brake_bike.png',
			'brake_handlerbar.png',
			'brake_lever.png',
		];
		for (const reItem of resources) {
			this.loader.add(reItem, `images/${reItem}`);
		}
	}
	//显示上屏的逻辑
	show() {
		//按钮容器
		this.actionButton = this.createActionButton();
		//自行车架容器
		this.bikeContainer = this.createBike();
		//粒子特效
		this.particle = this.createParticle()
		// 得到车刹车的引用
		const bikeLever = this.bikeContainer.children[0];
		//鼠标按下 刹车按住
		this.actionButton.on('mousedown', () => {
			gsap.to(bikeLever, {
				duration: .2,
				rotation: Math.PI / 180 * -30
			});
			gsap.to(this.bikeContainer,{
				x:5,
				y:25,
				duration:0.1
			})
			this.break()
		});
		//鼠标松开就回到原点
		this.actionButton.on('mouseup', () => {
			// bikeLever.rotation = 0
			gsap.to(bikeLever, {
				duration: .2,
				rotation: 0
			})
			gsap.to(this.bikeContainer,{
				x:0,
				y:0,
				duration:1
			});
			this.start()
		});
		//在场景中添加 粒子 车架 按钮
		this.stage.addChild(this.particle);
		this.stage.addChild(this.bikeContainer)
		this.stage.addChild(this.actionButton);
	}
	// 创建粒子
	createParticle() {
		let particleContainer = new PIXI.Container();
		let particles = [],
			colors = [0xf1cf54, 0xb5cea8, 0xf1cf54];
		particleContainer.rotation = Math.PI / 180 * 35;
		particleContainer.x = this.bikeContainer.width/3;
		//创建粒子
		for (let i = 0; i < 20; i++) {
			const gr = new PIXI.Graphics();
			gr.beginFill(colors[Math.floor(Math.random() * colors.length)]);
			gr.drawCircle(0, 0, 4);
			gr.endFill();
			let pItem = {
				sx: Math.random() * this.bikeContainer.width / 2,
				sy: Math.random() * this.bikeContainer.height,
				gr
			}
			gr.x = pItem.sx;
			gr.y = pItem.sy;
			
			particleContainer.addChild(gr);
			particles.push(pItem)
		}
		//循环执行的函数
		const loop = ()=>this.loop(particles);
		//开始
		const start = ()=>{
			// 速度初始化
			this.speed = 0;
			// 添加这个运动
			gsap.ticker.add(loop)
		}
		//停止
		const pause = ()=>{
			// 将loop函数移除
			gsap.ticker.remove(loop)
			// 回弹效果
			this.pause(particles)
		}
		this.start = start
		this.break = pause
		// 执行一遍
		start()
		return particleContainer
	}
	//动起来的函数
	loop(particles){
		this.speed +=.1;
		this.speed = Math.min(this.speed,20);
		for (const item of particles) {
			item.gr.y +=this.speed;
			item.gr.scale.y +=this.speed;
			item.gr.scale.y = Math.min(item.gr.scale.y,35)
			item.gr.scale.x = 0.1;
			if(item.gr.y>this.bikeContainer.height)item.gr.y=0;
		}
	}
	//停止函数
	pause(particles){
		for (const item of particles) {
			item.gr.scale.y = 1;
			item.gr.scale.x = 1;
			gsap.to(item.gr,{duration:.7,x:item.sx,y:item.sy,ease:'elastic.out'})
		}
	}
	//创建一个精灵
	createSprite(resource) {
		return new PIXI.Sprite(this.loader.resources[resource].texture)
	}
	//创建车身
	createBike() {
		const bikeContainer = new PIXI.Container();
		//车架的图片
		let brakeBike = this.createSprite('brake_bike.png');
		// 车把手
		let bikeHandlerBar = this.createSprite('brake_handlerbar.png');
		//创建车刹车
		let bikeLever = this.createSprite('brake_lever.png');
		// 设置车架容器的缩放比例
		bikeContainer.scale.x = bikeContainer.scale.y = 0.4

		//设置车刹车的圆心
		bikeLever.pivot.x = 455;
		bikeLever.pivot.y = 455;
		//设置车刹车的x,y值
		bikeLever.x = 722;
		bikeLever.y = 900;
		// bikeLever.rotation = Math.PI/180*-30
		bikeContainer.addChild(bikeLever);

		bikeContainer.addChild(brakeBike);

		bikeContainer.addChild(bikeHandlerBar);


		return bikeContainer
	}
	// 创建一个按钮的容器
	createActionButton() {
		let actionButton = new PIXI.Container();

		let btnImage = this.createSprite('btn.png')

		let btnCircle = this.createSprite('btn_circle.png')

		let btnCircle2 = this.createSprite('btn_circle.png')

		actionButton.addChild(btnImage)

		actionButton.addChild(btnCircle)

		actionButton.addChild(btnCircle2)
		// 设置按钮容器的宽高
		actionButton.width = 80;
		actionButton.height = 80;
		//改变btnImage的x,y的轴心
		btnImage.pivot.x = btnImage.pivot.y = btnImage.width / 2;
		// 改变btnCircle的x,y的轴心
		btnCircle.pivot.x = btnCircle.pivot.y = btnCircle.width / 2;
		// 改变btnCircle2的x,y的轴心
		btnCircle2.pivot.x = btnCircle2.pivot.y = btnCircle2.width / 2;
		// 设置按钮容器的位置
		actionButton.x = 200
		actionButton.y = 240;
		//设置圆环的缩放
		btnCircle.scale.x = btnCircle.scale.y = 0.8
		// 设置缓动动画 缩放
		gsap.to(btnCircle.scale, {
			duration: 1,
			x: 1.3,
			y: 1.3,
			repeat: -1
		})
		//使用gsap设置缓动动画 透明度
		gsap.to(btnCircle, {
			duration: 1,
			alpha: 0,
			repeat: -1
		})
		//给按钮容器添加一个交互行为 后面可以侦听处理事件
		actionButton.interactive = true;
		actionButton.cursor = 'pointer';
		return actionButton
	}
}