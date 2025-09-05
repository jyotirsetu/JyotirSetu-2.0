const heroImage = new Proxy({"src":"/_astro/hero-image.DwIC_L_T.png","width":1600,"height":939,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/assets/images/hero-image.png";
							}
							
							return target[name];
						}
					});

export { heroImage as default };
