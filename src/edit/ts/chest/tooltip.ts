import { ActDB, findBlockTag, findBlockTagOption, mouseInfo } from "../edit";
import type { Argument, GameValue, ParsedItem, Particle, Potion, SelectionBlock, Sound, SubActionBlock } from "edit/template";
import { dfNumber, minecraftColorHTML, MinecraftTextCompToCodes, stripColors } from "../../../main/main";
import { isDeveloperMode } from "../../../main/developers";
import { parse } from "nbt-ts";
import itemNames from './itemnames.json';

export default function tooltip(item : Argument, block : SelectionBlock | SubActionBlock ){ // tooltips (that are regenerated whenever you move your mouse over an item)
	mouseInfo.style.display = 'grid';
	mouseInfo.innerHTML = '';
	if (item.item.id === 'num' || item.item.id === 'txt') {
		let txt = document.createElement('div');
		minecraftColorHTML(item.item.data.name,item.item.id === 'num' ? '§c' : undefined).forEach(x => txt.appendChild(x));
		mouseInfo.append(txt);
	}
	else if (item.item.id === 'var'){
		let name = document.createElement('span');
		name.innerText = item.item.data.name;
		mouseInfo.append(name);
		let scope = document.createElement('span');
		if(item.item.data.scope === 'local'){
			scope.innerText = 'LOCAL';
			scope.style.color = '#55ff55'
		}
		else if(item.item.data.scope === 'saved'){
			scope.innerText = 'SAVE';
			scope.style.color = '#ffff55';
		}
		else {
			scope.innerText = 'GAME';
			scope.style.color = '#aaaaaa';
		}
		mouseInfo.append(scope);
	}
	else if (item.item.id === 'loc'){
		let title = document.createElement('span');
		title.innerText = 'Location';
		title.style.color = '#55ff55';
		mouseInfo.append(title);
		let x = document.createElement('span');
		x.innerText = 'X: ' + dfNumber(item.item.data.loc.x);
		mouseInfo.append(x);
		let y = document.createElement('span');
		y.innerText = 'Y: ' + dfNumber(item.item.data.loc.y);
		mouseInfo.append(y);
		let z = document.createElement('span');
		z.innerText = 'Z: ' + dfNumber(item.item.data.loc.z);
		mouseInfo.append(z);
		if(!item.item.data.isBlock){
			let pitch = document.createElement('span');
			pitch.innerText = 'p: ' + dfNumber(item.item.data.loc.pitch);
			mouseInfo.append(pitch);
			let yaw = document.createElement('span');
			yaw.innerText = 'y: ' + dfNumber(item.item.data.loc.yaw);
			mouseInfo.append(yaw);
		}
	}
	else if (item.item.id === 'vec'){
		let titlev = document.createElement('span');
		titlev.innerText = 'Vector';
		titlev.style.color = '#2affaa';
		mouseInfo.append(titlev);
		let xv = document.createElement('span');
		xv.innerText = 'X: ' + dfNumber(item.item.data.x);
		mouseInfo.append(xv);
		let yv = document.createElement('span');
		yv.innerText = 'Y: ' + dfNumber(item.item.data.y);
		mouseInfo.append(yv);
		let zv = document.createElement('span');
		zv.innerText = 'Z: ' + dfNumber(item.item.data.z);
		mouseInfo.append(zv);
	}
	else if (item.item.id === 'pot'){
		let titlepot = document.createElement('span');
		titlepot.innerText = 'Potion Effect';
		titlepot.style.color = '#ff557f';
		mouseInfo.append(titlepot);
		let typepot = document.createElement('span');
		typepot.innerHTML = minecraftColorHTML(ActDB.potions.find(x => stripColors(x.icon.name) === (item.item as Potion).data.pot).icon.name)[0].outerHTML
		mouseInfo.append(typepot);
		mouseInfo.append(document.createElement('hr'));
		let amp = document.createElement('span');
		amp.innerText = 'Amplifier: ' + String(item.item.data.amp)
		mouseInfo.append(amp);
		let dur = document.createElement('span');
		dur.innerText = 'Duration: ' + String(item.item.data.dur) + ' ticks';
		mouseInfo.append(dur);
	}
	else if (item.item.id === 'snd'){
		let titles = document.createElement('span');
		titles.innerText = 'Sound';
		titles.style.color = '#5555ff';
		titles.style.textShadow = '1px 1px #000'; // the original sound color contrasts really badly.
		mouseInfo.append(titles);
		let sound = document.createElement('span');
		sound.innerHTML = minecraftColorHTML(ActDB.sounds.find(s => stripColors(s.icon.name) === (item.item as Sound).data.sound).icon.name)[0].outerHTML;
		mouseInfo.append(sound);
		mouseInfo.append(document.createElement('hr'))
		let pitchs = document.createElement('span');
		pitchs.innerText = 'Pitch: ' + String(dfNumber(item.item.data.pitch));
		mouseInfo.append(pitchs)
		let volume = document.createElement('span');
		volume.innerText = 'Volume: ' + String(dfNumber(item.item.data.vol));
		mouseInfo.append(volume);
	}
	else if (item.item.id === 'g_val'){
		let gval = document.createElement('span');
		gval.innerHTML = minecraftColorHTML(ActDB.gameValues.find(g => stripColors(g.icon.name) === (item.item as GameValue).data.type).icon.name)[0].outerHTML;
		mouseInfo.append(gval);
		let selection = document.createElement('span');
		selection.innerText = item.item.data.target;
		if(item.item.data.target === 'Selection' || item.item.data.target === 'Default'){
			selection.style.color = '#55FF55'
		}
		else if(item.item.data.target === 'Killer' || item.item.data.target === 'Damager'){
			selection.style.color = '#FF5555'
		}
		else if(item.item.data.target === 'LastEntity' || item.item.data.target === 'Shooter'){
			selection.style.color = '#FFFF55';
			if(item.item.data.target === 'LastEntity'){
				selection.innerText = 'Last-Spawned Entity';
			}
		}
		else if(item.item.data.target === 'Victim'){
			selection.style.color = '#5555FF';
			selection.style.textShadow = '1px 1px #000';
		}
		else if(item.item.data.target === 'Projectile'){
			selection.style.color = '#55FFFF';
		}
		mouseInfo.append(selection);
		
		mouseInfo.append(document.createElement('hr'));
		const desc = document.createElement('span');
		const newLocal = ActDB.gameValues.find(g => stripColors(g.icon.name) === (item.item as GameValue).data.type);
		desc.innerText = newLocal.icon.description.join('\n');
		mouseInfo.append(desc);
	}
	else if (item.item.id === 'part'){
		let titlep = document.createElement('span');
		titlep.innerText = 'Particle Effect';
		titlep.style.color = '#aa55ff';
		titlep.style.textShadow = '1px 1px #000';
		mouseInfo.append(titlep);
		let par = document.createElement('span');
		par.innerHTML = minecraftColorHTML(ActDB.particleCategories.find(p => stripColors(p.icon.name) === (item.item as Particle).data.particle).icon.name)[0].outerHTML;
		mouseInfo.append(par);
		mouseInfo.append(document.createElement('hr'));
		let amount = document.createElement('span');
		amount.innerText = "Amount: " + String(item.item.data.cluster.amount);
		mouseInfo.append(amount);
		let spread = document.createElement('span');
		spread.innerText = 'Spread: ' + dfNumber(item.item.data.cluster.horizontal) + ' ' + dfNumber(item.item.data.cluster.vertical); // string templates go brrrrr // tbh this is mostly function so I think a string template would look worse but atleast I mention as such in a massive line to make mild refrence to the existance to string litterals, their often place in strings generated like this and their still uselessness here despite what they are usefull for.
		mouseInfo.append(spread);

		const dbParticle = ActDB.particleCategories.find(particle => particle.icon.name === (item.item as Particle).data.particle);
		// if the fields length has anything
		if(dbParticle.fields.length > 0){
			mouseInfo.append(document.createElement('hr'));
			
			if(dbParticle.fields.includes('Motion')){
				const motion = document.createElement('span');
				motion.innerText = `Motion: ${dfNumber(item.item.data.data.x)} ${dfNumber(item.item.data.data.y)} ${dfNumber(item.item.data.data.z)}`;
				motion.style.color = '#2affaa';
				mouseInfo.append(motion);
			}
			if(dbParticle.fields.includes('Motion Variation')){
				const motionVariation = document.createElement('span');
				motionVariation.innerText = 'Motion Variation: ' + String(item.item.data.data.motionVariation) + '%';
				mouseInfo.append(motionVariation);
			}

			if(dbParticle.fields.includes('Color')){
				const color = document.createElement('span');
				const colorHex = item.item.data.data.rgb.toString(16).toUpperCase(); // the color as #BLABLA
				color.innerText = 'Color: ' + colorHex;
				color.style.color = '#' + colorHex;
				mouseInfo.append(color);
			}
			if(dbParticle.fields.includes('Color Variation')){
				const colorVariation = document.createElement('span');
				colorVariation.innerText = 'Color Variation: ' + String(item.item.data.data.colorVariation) + '%';
				mouseInfo.append(colorVariation);
			}

			if(dbParticle.fields.includes('Material')){
				const material = document.createElement('span');
				material.innerText = 'Material: ' + item.item.data.data.material.toLowerCase();
				mouseInfo.append(material);
			}
		}
	}
	else if (item.item.id === 'bl_tag'){
		if(isDeveloperMode()) console.log(item);
		const tag = findBlockTagOption(block.block, block.action, item.item.data.tag, item.item.data.option);
		const tags = findBlockTag(block.block, block.action, item.item.data.tag);
		const tagName = document.createElement('span');
		tagName.innerText = 'Tag: ' + item.item.data.tag
		tagName.style.color = 'yellow';
		mouseInfo.append(tagName);
		mouseInfo.append(document.createElement('hr'));
		tags.options.forEach(t => {
			const tagElement = document.createElement('span');
			tagElement.innerText = t.name;
			if(t.name === tag.name){tagElement.style.color = 'aqua';}
			else{tagElement.style.color = 'white';}
			mouseInfo.append(tagElement);
		})
	}
	else if(item.item.id === 'item'){
		let data = parse(item.item.data.item) as unknown as ParsedItem;
		if(isDeveloperMode()) console.log(data);

		if(!data.tag){
			data.tag = {};
		}


		let ItemName = document.createElement('span');
		if(data.tag.display && data.tag.display.Name){
			minecraftColorHTML(MinecraftTextCompToCodes(data.tag.display.Name)).forEach(e => ItemName.append(e));

			mouseInfo.append(ItemName);
		}
		else {
			ItemName.innerText = (itemNames as any)[data.id.toLowerCase().replace('minecraft:', '')];
			mouseInfo.append(ItemName);
		}

		if(data.tag.display && data.tag.display.Lore && data.tag.display.Lore.length > 0){
			data.tag.display.Lore.forEach((l : string) => {
				let lore = document.createElement('span');
				minecraftColorHTML(MinecraftTextCompToCodes(l)).forEach(e => lore.append(e));
				mouseInfo.append(lore);
			})
		}

		mouseInfo.append(document.createElement('hr'));


		let ItemType = document.createElement('span');
		ItemType.innerText = data.id;
		ItemType.style.color = 'gray';
		ItemType.style.textShadow = '1px 1px #000';
		mouseInfo.append(ItemType);

		let ItemCount = document.createElement('span');
		ItemCount.innerText = 'Count: ' + data.Count.value;
		ItemCount.style.color = 'gray';
		ItemCount.style.textShadow = '1px 1px #000';
		mouseInfo.append(ItemCount);
	}
	else {
		let info = document.createElement('span');
		info.innerText = "It seems this item type\nisn't implemented yet."
		info.style.color = 'red';
		mouseInfo.append(info);
	}
	if(isDeveloperMode()) console.log(item.item);
}