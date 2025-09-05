const JyotirsetuLogo = new Proxy({"src":"/_astro/Jyotirsetu-logo.LM07GLCa.png","width":200,"height":60,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Akansh/Downloads/JyotirSetu-2.0-main/JyotirSetu-2.0-main/src/assets/images/Jyotirsetu-logo.png";
							}
							
							return target[name];
						}
					});

export { JyotirsetuLogo as default };
