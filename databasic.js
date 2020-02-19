COBY.var("databasic", function() {
	/*
		<?cob
			import t, range, jsonToElement, iz, f$, randomID
		?>
	*/
	this.me = range(0,280);
	this.start = function(opts) {
		if(!opts) opts = {};
		var server = opts.server || "",
			username = opts.username || "",
			password = opts.password || "",
			errorID = "error_" + Date.now() + Math.floor(
				Math.random() * 770) + 770;
		COBY.go({
			elements: [
				
				{
					innerHTML:"Login",
					tag:"h2",
					id:"login_pg",
					elements: {
					
						elements: [
							
							{
								tag:"input",
								id:"cob_username",
								value:username
							},
							{
								tag:"input",
								id:"cob_password",
								type:"password",
								value:password
							},
							{
								tag:"button",
								innerHTML:"Login",
								onadded(r) {
									
								},
								onclick(e) {
									if(a) {
										
										a.send({
											coybia: {
												user: {
													username: cob_username.value,
													password: cob_password.value
												},
												callback:"checkLogin"
											}
										})
									}
								}
							}
						]
					},
					added(d) {
						COBY.css(`
							body, input {
								font-family:helvetica;
								font-weight:800
							}
						`);
						a = new COBY.CobySocket({
									url: server,
									onopen(m) {
										console.log(m)
									},
									listeners: {
										coyb(data) {
											console.log("got", data);
										},
										inserted(d) {
											console.log("INSERT?", d);
											if(d.success) {
												a.send({
													coybia: {
														database: "userInfo",
														collection: "users",
														command: "find",
														callback: "showUsers"
													} 
												})
											} else {
												var err = f$(`.${errorID}`)
												if(err) {
													err.innerHTML = "";
												}		
											}
										},
										verifyDelete(d) {
											console.log("INSERT?", d);
											if(d.success) {
												a.send({
													coybia: {
														database: "userInfo",
														collection: "users",
														command: "find",
														callback: "showUsers"
													} 
												})
											} else {
												var err = f$(`.${errorID}`)
												if(err) {
													err.innerHTML = "";
												}		
											}
										},
										updatedUser(d) {
											console.log("UpDaTeD?", d);
											if(d.success) {
												a.send({
													coybia: {
														database: "userInfo",
														collection: "users",
														command: "find",
														callback: "showUsers"
													} 
												})
											} else {
												var err = f$(`.${errorID}`)
												if(err) {
													err.innerHTML = "";
												}	
											}
										},
										checkLogin(data) {
											console.log(data);
											if(data.success == "login success") {
												login_pg.style.display="none";
												dbPage.style.display="";
												a.send({
													coybia: {
														command:"find",
														database:"userInfo",
														collection:"users",
														callback:"showUsers"
													}
												})
											} else if(data.error) {
												var err = f$(`.${errorID}`)
												console.log("ERD?", err)
												if(err) {
													err.style.display = "";
													setInterval(function() {
														err.style.display = "none";
														err.innerHTML = "";
													}, 2000)
													err.innerHTML = data.error;
												}
											}
										},
										showUsers(data) {
											console.log(data);
											if(data.success) {
												//var newEl = jsonToElement(data.success)
												var els = [
													
												];
												if(t(data.success, Array)) {
													var ds = data.success;
													dbPage.innerHTML = "";
													
													
							
													ds.forEach((x, i) => {
														els.push(makeSection(x, {
															color: i % 2 ? "rgb(100, 100, 255)" : "rgb(177, 177, 255)"
														}))
													})
														
													
												}
												
												els.push({
														tag:"button",
														innerHTML:"Add",
														onclick() {
															
															a.send({
																coybia: {
																	database: "userInfo",
																	collection:"users",
																	command:"insertOne",
																	query: {
																		username: "user_770" + Date.now() + "770",
																		password: (
																			Math.floor(Math.random() * Math.pow(770, 7))
																			
																		) + "770"
																	},
																	callback: "inserted"
																}
															})
														}
												})
												var newEl = new COBY.element({
													innerHTML:"Users",
													elements: els
												});
												newEl.appendTo(dbPage)
											} else {
												document.write(data.error);
											}
										}
									}
						});
					}
				},
				{
					id: "dbPage",
					
					
					style: {
						display:"none"
					},
					innerHTML:"loading databases..."
				},
				{
					tag:"div",
					style: {
						display:"none",
						color:"red",
						fontWeight:100
					},
					className:errorID
				},
			]
		});
	}
	
	function makeSection(x) {
		var options = arguments[1] || {};
		var _id = x["_id"] || (
			Date.now() + 
			770 + 
			Math.floor(Math.random() * 880 + 770)
		)
		var name = "field_" + _id;
		var vals = [];
		var leftSpace = 40, el;
		for(var key in x) {
			if(key != "_id") {
				vals.push({
					
					className: key,
					elements: [
						{
							innerHTML: key,
							className: "key",
							tag:"span",
						},
						{
							innerHTML: ": ",
							tag:"span",
						},
						{
							tag:"span",
							className: "value",
							innerHTML:x[key]
						},
						{
							tag:"br"
						}
					]
				})
			}
		}
		
		var hiddenOnes = []
		
		var subEls = [
			{
				tag:"button",
				innerHTML:"Edit",
				className: name + "_editBtn",
				onclick(e) {
					if(!el) el = f$("."+name);
					var save = f$("."+name+"_editingButtons")
					
					if(save && el) {
						save.style.display="";
						hiddenOnes.forEach(y => {
							y.style.display = "";
							y.className = y.className.replace("hiddenOne", "")
						});
						hiddenOnes = [];
						
						e.target.style.display="none";
						var parent = el.parentNode;
						var holder = f$("." + name + "_editingHolder");
						
						el.style.display="none"
						var arr = Array.apply(null,el.childNodes),
							els = [];
							
						
						if(arr) {
								els = arr.map(x => {
									var keyEl = x.getElementsByClassName("key")[0],
										valEl = x.getElementsByClassName("value")[0];
									var key = keyEl ? keyEl.innerHTML :  "";
										value = valEl ? valEl.innerHTML :  "";
									
									return propertyEdit(key, value, {
										hiddenOnes: hiddenOnes,
										leftSpace: leftSpace,
										name: name
									})
								});
		
						}
						if(!holder) {
							holder = new COBY.element({
							//	innerHTML:"hi there<br>",
								className: name+"_editingHolder",
								elements: els
							})
							holder.appendTo(parent);
						} else {
							holder.style.display = "";
						}
						
					}
					
				}
			},
			{
				className: name + "_editingButtons",
				style: {
						display:"none"
				},
				elements: [
					{
						tag:"Button",
						innerHTML:"Cancel",
						onclick(e) {
							var editing = f$("."+name + "_editBtn");
							if(editing) {
								var el = f$("."+name);
								if(el) {
									el.style.display = ""
								}
								var holder = f$("." + name + "_editingHolder");
								if(holder) {
									holder.style.display = "none"
								}
								editing.style.display = "";
								e.target.parentNode.style.display = "none"
							}
						}
					},
					{
						tag:"Button",
						innerHTML:"Save",
						//805
						onclick(e) {
							var valueHolder = f$(`.${name}_editingHolder`)
							
							if(valueHolder) {
								var obj = {},
									hiddenObj = {}
								var props = Array.apply(0, valueHolder.childNodes);
								
									
									var hiddenID = randomID();
									props = props.map(x => {
										console.log(x.className)
										var inputs = Array.apply(0,
											x.getElementsByTagName("input")
										)
										
										var key = (inputs.find(
											x => x.className.includes("editKey")
												 
										) || {}).value;
										var value = (inputs.find(
											x => x.className.includes("editVal")
										) || {}).value;
										
										var rez;
										
										if(key) {
											rez = {};
											rez[key] = value || "";
											if(x.className.includes("hiddenOne")) {
												rez["hidden" + hiddenID] = true;
											}
										}
										return rez;
									})
									.filter(x => x);
									
									var revealeds = props.filter(x => !x["hidden" + hiddenID]),
										hiddens  = props.filter(x =>  x["hidden" + hiddenID])
									
									var originalData = x;
									console.log(originalData)
									revealeds.forEach(x => {
										for(var k in x) {
											if(k != hiddenID) {
												obj[k] = x[k]
											}
										}
									})
									var hs = 0;
									hiddens.forEach(x => {
										for(var k in x) {
											if(k != hiddenID) {
												if(
													originalData &&
													originalData[k]
												) {
													hs++;
													hiddenObj[k] = x[k]
												}
											}
										}
									})
									
									if(hs === 0) {
										hiddenObj = null;
									}
							}
							console.log(obj, hiddenObj, props);
							var removeableObjects = [];
							var sendObj = {};
							sendObj["coybia"] = {
								command:"updateOne",
								database:"userInfo",
								query: {
									_id: _id
								},
								updated: obj,
								collection:"users",
								callback:"updatedUser"
							};
							if(hiddenObj) {
								console.log(hiddenObj, "HID?");
								sendObj["coybia"]["unset"] = hiddenObj;
							}
							a.send(sendObj)
						},
						
					},
					{
						style: {
							display:"inline-block",
							width:177
						}
					},
					{
						tag:"button",
						innerHTML:"Delete",
						onclick(e) {
							var sendObj = {};
							sendObj["coybia"] = {
								command: "deleteOne",
								database: "userInfo",
								query: {
									_id: _id
								},
								collection: "users",
								callback: "verifyDelete"
								
								
							}
							
							a.send(sendObj)
						}
					}
				],
			},
			{
				elements: vals,
				className: name
			}
		]
		
		return {
			elements: subEls,
			sheim:"hi",
			style: {
				background:options.color || "salmon",
				padding: options.padding || 5,
				paddingLeft: options.leftSpace || leftSpace,
				overflow:"none"
			}
		}
	}
	
	function propertyEdit(key, value, options) {
		if(!options) options = {};
		var hiddenOnes = options.hiddenOnes || [],
			leftSpace =	t(options.leftSpace, Number) ? options.leftSpace : 1,
			name = options.name || Date.now() + Math.floor(
					Math.random() * 770
				)+ 770
		return {
			//	tag:"span",
				className: name + "_editingProperty",
				style: {
					display: key == "_id" ? "none" : ""
				},
				elements: [
					{
						tag:"button",
						innerHTML:"-",
						style: {
							marginLeft: -1 * leftSpace
						},
						onclick(e) {
							var pn = e.
							target.
							parentNode;
							pn.style.display = "none"
							pn.className += "hiddenOne";
							hiddenOnes.push(e.target.parentNode);
							console.log(key,value)
						}
					},
					{
						tag: "input",
						className:name + "_editKey",
						value: key
					},
					{
						tag:"span",
						innerHTML:":"
					},
					{
						tag:"input",
						className:name + "_editVal",
						value: value
					},
					{
						tag:"button",
						innerHTML:"+",
						style: {
							
						},
						onclick(e) {
							console.log(key,value)
						/*	var newVals = makeSection({
								username: Date.now(),
								password: Date.now() + Math.random() * 770 + 770
							})*/
							var newInput = f$(`.${
								name 
							}_editingProperty`) 
							if(newInput) {
								var newNode = new COBY.
									element(
										propertyEdit("", "", options)
									)
									
								newInput.parentNode.insertBefore(
									newNode.el, newInput.nextSibling
								)
								console.log(newInput, newInput.nextSibling)
							}
							
						}
					}
				]
				
			}
	}
});