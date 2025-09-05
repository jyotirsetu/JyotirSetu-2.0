const _2heroImage = new Proxy({"src":"/_astro/2hero-image.DaFZ3mN9.png","width":1024,"height":1024,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/assets/images/2hero-image.png";
							}
							
							return target[name];
						}
					});

export { _2heroImage as default };
