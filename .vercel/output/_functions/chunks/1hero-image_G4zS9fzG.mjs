const _1heroImage = new Proxy({"src":"/_astro/1hero-image.D95xeQCS.webp","width":1200,"height":630,"format":"webp"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/assets/images/1hero-image.webp";
							}
							
							return target[name];
						}
					});

export { _1heroImage as default };
