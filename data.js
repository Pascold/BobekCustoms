const raw = `
10F|21000000
Adder|17500000
Alpha|4300000
Autarch|26000000
Baller Sport|545000
Buccaneer Lowrider|2000000
Bestia GTS|2683000
Banshee|500000
Banshee 900r|14000000
Bf Injection|500000
Bifta|400000
Brawler|3000000
Brioso300|1536462
Brioso300 WideBody|3900000
Brioso R/A|500000
Btype|595000
Btype Hotrood|1150000
Btype Luxe|462000
Blazer|1000000
Blazer Custom|2500000
Buccaneer|618000
Burrito Customs|500000
Buffalo|3000000
Buffalo S|7000000
benson|3000000
Comet CUSTOM|6000000
Contender|9870000
Cyclone|19500000
Chino Lowrider|1500000
Caracara|12250000
Carbonizzare|4953000
Cavalcade|750000
Cavalcade XL|17500000
Casco|32000000
Comet 5|13000000
Comet s2|1184000
Comet Sr|13000000
Comet Drift|3300000
Coquette|1450000
Cypher|2500000
Calico|945000
Dominator|2350000
Desert Raid|22600000
Dominator ASP|942500
Dominator GTT|634000
Dominator GTX|6500000
Dubsta 6x6|66666666
Deviant|7000000
Drafter|1500000
Draugur|30000000
Dubsta luxuary|1500000
Dukes|580000
Dune Buggy|1500000
elegy retro|6000000
elegy rh8|4000000
Emerus|8000000
everon|14835000
Entity XF|12500000
Euros|1234567
Furia|4000000
Faction|1300000
Faction Donk|4120000
Feltzer|9500000
Freecrawler|11000000
FCR1000|2500000
Furore GT|435000
Futo drift|1080808
Gang Buritto|500000
Glendale Lowrider|2850000
Gauntlet|380000
Ganuntlet classic|800000
GUARDIAN|18000000
Gauntlet Hellfire|6411000
Granger|350000
GT 500|28000000
Growler|2489644
Hakouchu Drag (motocykl)|16000000
Helion|16000000
Hermes|3500000
hustler|2800000
Huntley S|4000000
Itali GTB|4158624
Itali GTB CUSTOM|13000000
Itali rsx|16000000
Innovation|13000000
Itali GTO|20000000
Impaler ZS|1345000
Impaler LX|485000
Imorgon|1000000
Issi Modern|6150000
Issi Classic|2000000
Jester|7500000
Jester Classic|4500000
Journey|350000
Jester rr|3000000
Jugular|17500000
Kreiger|12000000
Kamacho|5458796
Kanjo SJ|2500000
Komoda|15000000
Kuruma|3480000
LM87|80000000
Locust|5993527
Lynx|650000
Mamba|23000000
Massacro (Racecar)|730000
Mesa Trail|750000
Monroe|615000
Minivan Lowrider|8000000
Moonbeam Lowrider|2250000
Moonbeam|750000
MoonBeam Rider|390000
Mule 3|5000000
Nero|32000000
Neon|19000000
Neo|1500000
Nebula|350000
Nightshade|5000000
Novak|18000000
Outlaw|1800000
Obey 9F Cabrio|4500000
Obey 9F|4000000
Omnis|5800000
Osiris|14000000
penetrator|8000000
Previon|3000000
Primo Lowrider|1000000
Peyote Lowrider|1500000
Paragon|3000000
Pariah|11000000
Patriot|3000000
Patriot Limo|5000000
Peyote 2|2250000
Postlude|2700000
Rhinehart|6800000
RT 3000|900000
Raiden|2500000
Riata|22000000
remus|10000000
Reever|10000000
Rebel|450000
Reaper|14500000
Rebla GTs|2000000
Retinue MK II|850000
Ruiner ZZ8|6150000
SMZ722|150000000
Schafter V12|11750000
Sabre GT|1220000
Sabre GT Lowrider|6544000
Sabre Turbo|1045000
Slavman2|400000
Schlagen|14750000
sc1|10000000
Shinobi|16000000
Stretch|2300000
Swinger|14500000
Spectre|3835000
SPECTER CUSTOM|8000000
Streiter|8700000
Slamvan Lowrider|2400000
Sugoi|2000000
Superd Diamond|350000
Sultan rs classic|6000000
Sultan RS|16000000
Sultan Classic|800000
Stafford|18000000
Sentinel classic|4800000
Sentinel Classic Widebody|11000000
slamvan|350000
Tyrus|17000000
Thrax|20000000
Tailgater S|10000000
Tampa Drift|6500000
Trophy Truck|21000000
Torero XO|16000000
Tornado Lowrider|1750000
Tempesta|3800000
Tropos|5000000
Tulip|540000
Turismor|14000000
T20|15000000
Toros|22000000
Vagrant|1200000
Vigero ZX|7560000
Virgo Lowride|2150000
Virgo classic|1850000
Voodoo Lowrider|750000
Vstr|12000000
Veto Modern|350000
Warrener HKR|1237000
Weevil Custom|4500000
Windsor|500000
XLS|650000
Yosemite drifft|1500000
Youga Customs|5800000
Yosemite|1500000
Yosemite2|400000
yosemite3|350000
Zion Classic|1350000
Zorrusso|3500000
Zentorno|12000000
Zr350|647000
z-type|100000000
z190|38000000
`;

const cars = raw.trim()
  ? raw.trim().split(/\r?\n/).map(line => {
      const [name, salonPrice] = line.split('|');
      const salon = Number(salonPrice);
      return {
        name: name.trim(),
        salon,
        full: Math.round(salon * .7),
        engine: Math.round(salon * .21),
        gear: Math.round(salon * .14),
        turbo: Math.round(salon * .175),
        susp: Math.round(salon * .105),
        brakes: Math.round(salon * .14),
        armor: Math.round(salon * .14)
      };
    }).filter(car => car.name && Number.isFinite(car.salon) && car.salon > 0)
  : [];

window.cars = cars;
window.fmt = n => new Intl.NumberFormat('pl-PL').format(n) + ' $';