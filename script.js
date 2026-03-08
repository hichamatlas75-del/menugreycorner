/******************************************
 * MENU DATA (Mise à jour : Prix sans DH, Tri décroissant)
 ******************************************/

const menuData = [
  // =========================
  // PETIT DÉJEUNER
  // =========================
  {
    category: {
      fr: "PETIT DÉJEUNER",
      en: "BREAKFAST",
      de: "FRÜHSTÜCK"
    },
    id: "petit-dejeuner",
    items: [
      {
        name: { fr: "BRUNCH DUO", en: "BRUNCH DUO", de: "BRUNCH DUO" },
        description: {
          fr: "Poulet pané, croquettes, croque-maison, omelette au fromage, charcuterie, fromage, pain seigle, beldi (2 mlaoui, 2 harcha), mesclun salade, muffin, gaufre, 2 jus d'orange, 2 boissons chaudes au choix, 2 desserts et 2 eaux minérales.",
          en: "Breaded chicken, croquettes, homemade croque, cheese omelette, cold cuts, cheese, rye bread, beldi (2 mlaoui, 2 harcha), mesclun salad, muffin, waffle, 2 orange juices, 2 hot drinks of choice, 2 desserts, and 2 mineral waters.",
          de: "Paniertes Hähnchen, Kroketten, hausgemachtes Croque, Käseomelett, Aufschnitt, Käse, Roggenbrot, Beldi (2 Mlaoui, 2 Harcha), Mesclun-Salat, Muffin, Waffel, 2 Orangensäfte, 2 Heißgetränke nach Wahl, 2 Desserts und 2 Mineralwasser."
        },
        price: "144",
        image: "images/petit-dej-duo.jpg"
      },
      {
        name: { fr: "BRUNCH GREYCORNER", en: "GREYCORNER BRUNCH", de: "GREYCORNER BRUNCH" },
        description: {
          fr: "Saucisses, omelette, fromage, toast hollandais, croquettes fromage, charcuteries, pain seigle, mesclun salade, gaufre, pancake, jus d'orange, boisson chaude au choix, dessert et eau minérale.",
          en: "Sausages, omelette, cheese, Dutch toast, cheese croquettes, cold cuts, rye bread, mesclun salad, waffle, pancake, orange juice, hot drink of choice, dessert, and mineral water.",
          de: "Würstchen, Omelett, Käse, holländischer Toast, Käsekroketten, Aufschnitt, Roggenbrot, Mesclun-Salat, Waffel, Pfannkuchen, Orangensaft, Heißgetränk nach Wahl, Dessert und Mineralwasser."
        },
        price: "85",
        image: "images/petit-dej-gc.jpg"
      },
      {
        name: { fr: "AMERICAIN", en: "AMERICAN", de: "Amerikanisch" },
        description: {
          fr: "Bacon, avocat, 2oeufs, fromage, pain céréales, jus d'orange, boisson chaude au choix, dessert et eau minérale.",
          en: "Bacon, avocado, 2eggs, cheese, cereal bread, orange juice, hot drink of choice, dessert, and mineral water.",
          de: "Bacon, Avocado, 2 Eier,  Käse, Getreidebrot, Orangensaft, Heißgetränk nach Wahl, Dessert und Mineralwasser."
        },
        price: "68",
        image: "images/petit-dej-americain.jpg",
isNew: true
      },
  {
        name: { fr: "NORVÉGIEN", en: "NORWEGIAN", de: "NORWEGISCH" },
        description: {
          fr: "Saumon, avocat, fromage, pain céréales, jus d'orange, boisson chaude au choix, dessert et eau minérale.",
          en: "Salmon, avocado, cheese, cereal bread, orange juice, hot drink of choice, dessert, and mineral water.",
          de: "Lachs, Avocado, Käse, Getreidebrot, Orangensaft, Heißgetränk nach Wahl, Dessert und Mineralwasser."
        },
        price: "68",
        image: "images/petit-dej-norvegien.jpg"
      },
      {
        name: { fr: "ESPAGNOL", en: "SPANISH", de: "SPANISCH" },
        description: {
          fr: "Tortilla, croquettes, tapenade, thon, tomates fraiche, fromage, pain seigle et mesclun salade, jus d'orange, boisson chaude au choix, dessert et eau minérale.",
          en: "Tortilla, croquettes, tapenade, tuna, fresh tomatoes, cheese, rye bread, mesclun salad, orange juice, hot drink of choice, dessert, and mineral water.",
          de: "Tortilla, Kroketten, Tapenade, Thunfisch, frische Tomaten, Käse, Roggenbrot, Mesclun-Salat, Orangensaft, Heißgetränk nach Wahl, Dessert und Mineralwasser."
        },
        price: "64",
        image: "images/petit-dej-espagnol.jpg"
      },
      {
        name: { fr: "MQUILA MERGUEZ", en: "MQUILA Merguez sausage ", de: "MQUILA Merguez-Wurst" },
        description: {
          fr: "Merguez, poivrons, oignons, tomates cerises, deux œufs, jus d'orange, boisson chaude au choix, dessert et eau minérale.",
          en: "Merguez, peppers, onions, cherry tomatoes, two eggs, orange juice, hot drink of choice, dessert, and mineral water.",
          de: "Merguez, Paprika, Zwiebeln, Kirschtomaten, zwei Eier, Orangensaft, Heißgetränk nach Wahl, Dessert und Mineralwasser."
        },
        price: "64",
        image: "images/petit-dej-mquila.jpg"
      },
 {
        name: { fr: "MQUILA-fruits de mer", en: "MQUILA-SEAFOOD", de: "MQUILA-Meeresfrüchte" },
        description: {
          fr: "Crevette, calamar, moules, oignons, deux œufs, jus d'orange, boisson chaude au choix, dessert et eau minérale.",
          en: "Shrimp, squid, mussels, onions, two eggs, orange juice, hot drink of your choice, dessert, and mineral water.",
          de: "Garnelen, Tintenfisch, Muscheln, Zwiebeln, zwei Eier, Orangensaft, Heißgetränk nach Wahl, Dessert und Mineralwasser."
        },
        price: "78",
        image: "images/petit-dej-mquila-fruitmer.jpg",
isNew: true
      },

      {
        name: { fr: "OMELETTE DU CHEF", en: "CHEF'S OMELETTE", de: "OMELETT DES CHEFKOCHS" },
        description: {
          fr: "Omelette 3 œufs, champignons, épinards, fromage, mesclun salade, jus d'orange, boisson chaude au choix, dessert et eau minérale (supplément œufs beldi 05 DH).",
          en: "3-egg omelette, mushrooms, spinach, cheese, mesclun salad, orange juice, hot drink of choice, dessert, and mineral water (add free-range eggs 05 DH).",
          de: "3-Eier-Omelett, Pilze, Spinat, Käse, Mesclun-Salat, Orangensaft, Heißgetränk nach Wahl, Dessert und Mineralwasser (Zusatz Freilandeier 05 DH)."
        },
        price: "58",
        image: "images/petit-dej-chef.jpg"
      },
      {
        name: { fr: "HOLLANDAIS", en: "DUTCH", de: "HOLLÄNDISCH" },
        description: {
          fr: "Pain de mie complet avec deux œufs au plat, fromage, dinde fumée, mesclun salade, jus d'orange, boisson chaude au choix, dessert et eau minérale.",
          en: "Wholemeal sandwich bread with two fried eggs, cheese, smoked turkey, mesclun salad, orange juice, hot drink of choice, dessert, and mineral water.",
          de: "Vollkorn-Toastbrot mit zwei Spiegeleiern, Käse, geräucherter Pute, Mesclun-Salat, Orangensaft, Heißgetränk nach Wahl, Dessert und Mineralwasser."
        },
        price: "52",
        image: "images/petit-dej-hollandais.jpg"
      },
      {
        name: { fr: "OMELETTE VEGETARIENNE", en: "VEGETARIAN OMELETTE", de: "VEGETARISCHES OMELETT" },
        description: {
          fr: "Omelette 3 œufs, légumes, mesclun salade, jus d'orange, boisson chaude au choix, dessert et eau minérale (supplément œufs beldi 05 DH).",
          en: "3-egg omelette, vegetables, mesclun salad, orange juice, hot drink of choice, dessert, and mineral water (add free-range eggs 05 DH).",
          de: "3-Eier-Omelett, Gemüse, Mesclun-Salat, Orangensaft, Heißgetränk nach Wahl, Dessert und Mineralwasser (Zusatz Freilandeier 05 DH)."
        },
        price: "52",
        image: "images/petit-dej-veg.jpg"
      },
      {
        name: { fr: "BERBÈRE", en: "BERBER", de: "BERBER" },
        description: {
          fr: "Baghrir, amlou, fruits secs, jben, miel, banane, jus d'orange, boisson chaude au choix, dessert et eau minérale.",
          en: "Baghrir, amlou, dried fruits, jben (fresh cheese), honey, banana, orange juice, hot drink of choice, dessert, and mineral water.",
          de: "Baghrir, Amlou, Trockenfrüchte, Jben (Frischkäse), Honig, Banane, Orangensaft, Heißgetränk nach Wahl, Dessert und Mineralwasser."
        },
        price: "54",
        image: "images/petit-dej-berbere.jpg"
      },
      {
        name: { fr: "COMPAGNAD", en: "COPAGNARD", de: "COMPAGNAR" },
        description: {
          fr: "3 Œuf brouillé ,3 charcuterie, 2 pain cake chocolat ,pain seigle, huile d’olive , olive , mesclun salade, jus d'orange, boisson chaude au choix, dessert et eau minérale.",
          en: "3 scrambled eggs, 3 cold cuts, 2 slices of chocolate cake, rye bread, olive oil, olive , mesclun salad, orange juice, hot drink of your choice, dessert, and mineral water.",
          de: "3 Rühreier, 3 Sorten Aufschnitt, 2 Stücke Schokoladenkuchen, Roggenbrot, Olivenöl, schwarze Oliven , Mesclun-Salat, Orangensaft, Heißgetränk nach Wahl, Dessert und Mineralwasser."
        },
        price: "52",
        image: "images/petit-dej-compagnard.jpg",
isNew: true
      },
      {
        name: { fr: "FASSI", en: "FASSI", de: "FASSI" },
        description: {
          fr: "Khli3, trois œufs au plat, jus d'orange, boisson chaude au choix, dessert et eau minérale (supplément œufs beldi 5 DH).",
          en: "Khli3 (dried meat), three fried eggs, orange juice, hot drink of choice, dessert, and mineral water (add free-range eggs 5 DH).",
          de: "Khli3 (Trockenfleisch), drei Spiegeleier, Orangensaft, Heißgetränk nach Wahl, Dessert und Mineralwasser (Zusatz Freilandeier 5 DH)."
        },
        price: "55",
        image: "images/petit-dej-fassi.jpg"
      },
      {
        name: { fr: "OMELETTE CONTINENTAL", en: "CONTINENTAL OMELETTE", de: "CONTINENTALES OMELETT" },
        description: {
          fr: "Omelette 3 œufs, charcuterie, fromage, mesclun salade, jus d'orange, boisson chaude au choix, dessert et eau minérale (supplément œufs beldi 5 DH).",
          en: "3-egg omelette, cold cuts, cheese, mesclun salad, orange juice, hot drink of choice, dessert, and mineral water (add free-range eggs 5 DH).",
          de: "3-Eier-Omelett, Aufschnitt, Käse, Mesclun-Salat, Orangensaft, Heißgetränk nach Wahl, Dessert und Mineralwasser (Zusatz Freilandeier 5 DH)."
        },
        price: "52",
        image: "images/petit-dej-cont.jpg"
      },
      {
        name: { fr: "OMELETTE FROMAGE", en: "CHEESE OMELETTE", de: "KÄSE-OMELETT" },
        description: {
          fr: "Omelette 3 œufs, fromage, mesclun salade, jus d'orange, boisson chaude au choix, dessert et eau minérale",
          en: "3-egg omelette, cheese, mixed greens salad, orange juice, choice of hot beverage, dessert, and mineral water",
          de: "3-Ei-Omelett, Käse, gemischter Salat, Orangensaft, Heißgetränk nach Wahl, Dessert und Mineralwasser"
        },
        price: "52",
        image: "images/omelette-fromage.jpg"
      },
      {
        name: { fr: "BELDI", en: "BELDI", de: "BELDI" },
        description: {
          fr: "Deux mlaoui, deux harcha, un baghrir, jben, huile d’olive, miel, olives noires, jus d'orange, boisson chaude au choix, dessert et eau minérale.",
          en: "Two mlaoui, two harcha, one baghrir, jben (fresh cheese), olive oil, honey, black olives, orange juice, hot drink of choice, dessert, and mineral water.",
          de: "Zwei Mlaoui, zwei Harcha, ein Baghrir, Jben (Frischkäse), Olivenöl, Honig, schwarze Oliven, Orangensaft, Heißgetränk nach Wahl, Dessert und Mineralwasser."
        },
        price: "45",
        image: "images/petit-dej-beldi.jpg"
      },
      {
        name: { fr: "OMELETTE NATURE", en: "PLAIN OMELETTE", de: "NATUR-OMELETT" },
        description: {
          fr: "Omelette 3 œufs, mesclun salade, jus d'orange, boisson chaude au choix, dessert et eau minérale",
          en: "3-egg omelette, mixed greens salad, orange juice, choice of hot beverage, dessert, and mineral water",
          de: "3-Ei-Omelett, gemischter Salat, Orangensaft, Heißgetränk nach Wahl, Dessert und Mineralwasser"
        },
        price: "42",
        image: "images/omelette-nature.jpg"
      },
      {
        name: { fr: "LIGHT", en: "LIGHT", de: "LEICHT" },
        description: {
          fr: "Pain complet grillé, jben, huile d’olive, amlou, olives noires, jus d'orange, boisson chaude au choix, dessert et eau minérale.",
          en: "Toasted wholemeal bread, jben (fresh cheese), olive oil, amlou (nut spread), black olives, orange juice, hot drink of choice, dessert, and mineral water.",
          de: "Getoastetes Vollkornbrot, Jben (Frischkäse), Olivenöl, Amlou (Nussaufstrich), schwarze Oliven, Orangensaft, Heißgetränk nach Wahl, Dessert und Mineralwasser."
        },
        price: "42",
        image: "images/petit-dej-light.jpg"
      },
      {
        name: { fr: "EXPRESS", en: "EXPRESS", de: "EXPRESS" },
        description: {
          fr: "Panier de quatre viennoiseries, jus d'orange, boisson chaude au choix, dessert et eau minérale.",
          en: "Basket of four pastries, orange juice, hot drink of choice, dessert, and mineral water.",
          de: "Korb mit vier Gebäckstücken, Orangensaft, Heißgetränk nach Wahl, Dessert und Mineralwasser."
        },
        price: "44",
        image: "images/petit-dej-express.jpg"
      },
      {
        name: { fr: "MENU ENFANT", en: "KIDS MENU", de: "KINDERMENÜ" },
        description: {
          fr: "Toast au fromage, ou Crêpe Nutella, ou gaufre, ou pancake, corn flakes, Lait au chocolat.",
          en: "Cheese toast, or Nutella crêpe, or waffle, or pancake, corn flakes, chocolate milk.",
          de: "Käsetoast, oder Nutella Crêpe, oder Waffel, oder Pfannkuchen, Cornflakes, Schokomilch."
        },
        price: "40",
        image: "images/menu-enfant-pdj.jpg"
      }
    ]
  },

  // =========================
  // ENTRÉES FROIDES
  // =========================
  {
    category: {
      fr: "ENTRÉES FROIDES",
      en: "COLD STARTERS",
      de: "KALTE VORSPEISEN"
    },
    id: "entrees",
    items: [
      {
        name: { fr: "BURRATTA", en: "BURRATA", de: "BURRATA" },
        description: {
          fr: "Burrata, tomate, noix, roquette, Vinaigre balsamique.",
          en: "Burrata, tomato, walnuts, arugula, balsamic vinegar.",
          de: "Burrata, Tomate, Walnüsse, Rucola, Balsamico-Essig."
        },
        price: "98",
        image: "images/entree-burrata.jpg"
      },
      {
        name: { fr: "TERRE MER", en: "SURF & TURF", de: "SURF & TURF" },
        description: {
          fr: "Calamar, gambas, poulet pané, laitue, maïs, tomate cerise, sauce du chef.",
          en: "Calamari, shrimp, breaded chicken, lettuce, corn, cherry tomato, chef's sauce.",
          de: "Tintenfisch, Garnelen, paniertes Hähnchen, Salat, Mais, Kirschtomate, Soße des Chefkochs."
        },
        price: "78",
        image: "images/entree-terremer.jpg"
      },
      {
        name: { fr: "TARTARE SAUMON  ", en: "Salmon tartare", de: "Lachstatar" },
        description: {
          fr: "Saumon frais, saumon fumée, avocat, , sauce tartare.",
          en: "Fresh salmon, smoked salmon, avocado, tartar sauce.",
          de: "Frischer Lachs, geräucherter Lachs, Avocado, Tartarsauce."
        },
        price: "88",
        image: "images/entree-tartare.jpg",
isNew: true
      },
      {
        name: { fr: "QUINOA", en: "QUINOA", de: "QUINOA" },
        description: {
          fr: "Quinoa varié, gambas, brunoise, pomme, kiwi, mangue, ananas, menthe, sauce miel, motard.",
          en: "Assorted quinoa, shrimp, brunoise, apple, kiwi, mango, pineapple, mint, honey mustard sauce.",
          de: "Verschiedener Quinoa, Garnelen, Brunoise, Apfel, Kiwi, Mango, Ananas, Minze, Honig-Senf-Soße."
        },
        price: "68",
        image: "images/entree-quinoa.jpg"
      },
      {
        name: { fr: "CESAR", en: "CAESAR", de: "CAESAR" },
        description: {
          fr: "Boudin de poulet, parmesan, tomate cerise, crouton, laitue romaine, sauce césar.",
          en: "Chicken sausage, parmesan, cherry tomato, crouton, romaine lettuce, Caesar sauce.",
          de: "Hähnchenwurst, Parmesan, Kirschtomate, Crouton, Römersalat, Caesar-Soße."
        },
        price: "65",
        image: "images/entree-caesar.jpg"
      },
      {
        name: { fr: "RUSSE", en: "RUSSIAN", de: "RUSSISCH" },
        description: {
          fr: "Pomme de terre, carotte, poulet, thon, petit pois, œuf de caille.",
          en: "Potato, carrot, chicken, tuna, peas, quail egg.",
          de: "Kartoffel, Karotte, Hähnchen, Thunfisch, Erbsen, Wachtelei."
        },
        price: "54",
        image: "images/entree-russe.jpg"
      },
      {
        name: { fr: "CERCLE VEGGI", en: "VEGGI CIRCLE", de: "VEGGI KREIS" },
        description: {
          fr: "Crudité du jour, thon, œuf, salade, mesclun.",
          en: "Raw vegetables of the day, tuna, egg, salad, mesclun.",
          de: "Rohkost des Tages, Thunfisch, Ei, Salat, Mesclun."
        },
        price: "48",
        image: "images/entree-veggi.jpg"
      }
    ]
  },

  // =========================
  // ENTRÉES CHAUDES
  // =========================
  {
    category: {
      fr: "ENTRÉES CHAUDES",
      en: "HOT STARTERS",
      de: "WARME VORSPEISEN"
    },
    id: "entrees-chaudes",
    items: [
      {
        name: { fr: "CROUSTILLON GAMBAS", en: "SHRIMP CRUSTILLON", de: "GARNELEN-CROUSTILLON" },
        description: {
          fr: "Purée de pomme de terre, gambas panées au sésame blanc.",
          en: "Mashed potatoes, shrimp breaded with white sesame.",
          de: "Kartoffelpüree, Garnelen paniert mit weißem Sesam."
        },
        price: "68",
        image: "images/entree-croustillon.jpg"
      },
      {
        name: { fr: "PIL PIL ESPAGNOL", en: "SPANISH PIL PIL", de: "SPANISCHES PIL PIL" },
        description: {
          fr: "Gambas, huile d'olive, piment fort, ciboulette, tomate cerise.",
          en: "Shrimp, olive oil, hot pepper, chives, cherry tomato.",
          de: "Garnelen, Olivenöl, scharfe Paprika, Schnittlauch, Kirschtomate."
        },
        price: "68",
        image: "images/entree-pilpil.jpg"
      },
      {
        name: { fr: "BOULETTES DE POULET FROMAGE", en: "Chicken meatball with cheese", de: "Hähnchenfleischbällchen mit Käse" },
        description: {
          fr: "4 Blanc de poulet haché, cheddar.",
          en: "4 Minced chicken breast, cheddar",
          de: "4 Gehackte Hähnchenbrust, Cheddar."
        },
        price: "52",
        image: "images/entree-boulette-poulet.jpg",
isNew: true
      }
    ]
  },

  // =========================
  // PLATS
  // =========================
  {
    category: {
      fr: "PLATS",
      en: "MAIN COURSES",
      de: "HAUPTGERICHTE"
    },
    id: "plats",
    items: [
      {
        name: { fr: "PAVÉ DE SAUMON À LA PLANCHA ", en: "Grilled salmon fillet", de: "Lachssteak vom Grill" },
        description: {
          fr: "Pavé de saumon saisi, sauce vierge maison aux petits légumes croquants et herbes fraîches  ",
          en: "Seared salmon fillet, homemade “sauce vierge” with crunchy vegetables and fresh herbs.",
          de: "Kurz gebratenes Lachssteak, hausgemachte Vierge-Sauce mit knackigem Gemüse und frischen Kräutern."
        },
        price: "145",
        image: "images/plat-saumon.jpg"
      },
      {
        name: { fr: "FILET DE BŒUF AUX HERBES DE L'ATLAS ", en: "Beef fillet with Atlas herbs", de: "Rinderfilet mit Atlas-Kräutern" },
        description: {
          fr: "Cœur de filet de bœuf saisi, infusé aux herbes aromatiques de l'Atlas",
          en: "Seared beef tenderloin heart, infused with aromatic Atlas herbs.",
          de: "Kurz gebratenes Rinderfiletherz, mit aromatischen Atlas-Kräutern verfeinert"
        },
        price: "135",
        image: "images/plat-filet.jpg"
      },
      {
        name: { fr: "ROULADE DE BŒUF AUX SAVEURS DE L'ATLAS ", en: "Beef roulade with flavors of the Atlas", de: "Rinderroulade mit Aromen des Atlas" },
        description: {
          fr: "Viande de bœuf hachée, farce épinards et fromages, sauce crème fraîche et champignons frais",
          en: "Minced beef, spinach and cheese stuffing, fresh cream sauce with fresh mushrooms",
          de: "Hackfleisch vom Rind, Spinat- und Käsefüllung, Sahnesauce mit frischen Champignons"
        },
        price: "120",
        image: "images/plat-rouladeboeuf.jpg",
isNew: true
      },
      {
        name: { fr: "LE FILET DE BŒUF ÉMINCÉ ", en: "Sliced beef fillet", de: "Geschnittenes Rinderfilet" },
        description: {
          fr: "Cœur de filet de bœuf, champignons de Paris frais, crème onctueuse, fines herbes",
          en: "Beef tenderloin heart, fresh button mushrooms, creamy sauce, fine herbs",
          de: "Rinderfiletherz, frische Champignons, cremige Sauce, feine Kräuter."
        },
        price: "115",
        image: "images/plat-eminceboeuf.jpg"
      },
      {
        name: { fr: "SUPRÊME DE POULET AUX CHAMPIGNONS ET PERSILLADE ", en: "Chicken supreme with mushrooms and parsley garlic butter", de: "Hähnchenbrust „Suprême“ mit Champignons und Petersilien-Knoblauchbutter" },
        description: {
          fr: "Suprême de poulet saisi, sauce veloutée à la crème, champignons frais, persil ciselé",
          en: "Seared chicken supreme, creamy velouté sauce, fresh mushrooms, chopped parsley",
          de: "Kurz gebratene Hähnchenbrust „Suprême“, samtige Rahmsauce, frische Champignons, gehackte Petersilie"
        },
        price: "98",
        image: "images/plat-supreme.jpg",
isNew: true
      },
  
      {
        name: { fr: "ESCALOPE A LA MILANAISE", en: "MILANESE ESCALOPE", de: "MAILÄNDER SCHNITZEL" },
        description: {
          fr: "Escalope de poulet panée dorée, sauce veloutée aux champignons frais.",
          en: "Golden breaded chicken escalope, creamy sauce with fresh mushrooms",
          de: "Goldbraune panierte Hähnchenschnitzel, samtige Sauce mit frischen Champignons"
        },
        price: "85",
        image: "images/plat-milanaise.jpg"
      },
      {
        name: { fr: "BROCHETTES DE POULET MARINÉES  ", en: "Marinated chicken skewers", de: "Marinierte Hähnchenspieße" },
        description: {
          fr: "Blanc de poulet sélectionné, marinade aromatique grillé sur broche, sauce barbecue",
          en: "Selected chicken breast, aromatic marinade, grilled on skewers, barbecue sauce",
          de: "Ausgewählte Hähnchenbrust, aromatische Marinade, gegrillt auf Spießen, Barbecue-Sauce"
        },
        price: "84",
        image: "images/plat-brochette.jpg"
      },
      {
        name: { fr: "ÉMINCÉ DE POULET À LA CRÈME DE CHAMPIGNONS ", en: "Sliced chicken in creamy mushroom sauce", de: "Hähnchengeschnetzeltes in cremiger Champignonsauce" },
        description: {
          fr: "Morceaux de poulet saisis, sauce onctueuse aux champignons de Paris frais",
          en: "Seared chicken pieces, creamy sauce with fresh button mushrooms",
          de: "Kurz gebratene Hähnchenteile, samtige Sauce mit frischen Champignons."
        },
        price: "88",
        image: "images/plat-emincepoulet.jpg"
      },
      {
        name: { fr: "BALLOTINE DE POULET AU CŒUR D'ÉPINARDS ET FROMAGE ", en: "Chicken ballotine with spinach and cheese filling", de: "Hähnchen-Ballotine mit Spinat- und Käsefüllung" },
        description: {
          fr: "Volaille hachée, cœur épinards et fromage affiné, sauce exclusive du Chef",
          en: "Minced poultry, spinach and aged cheese center, Chef’s signature sauce",
          de: "Gehacktes Geflügel, Herz aus Spinat und gereiftem Käse, exklusive Sauce des Küchenchefs"
        },
        price: "94",
        image: "images/plat-ballotine.jpg"
      },
      {
        name: { fr: "MENU ENFANT", en: "KIDS MENU", de: "KINDERMENÜ" },
        description: {
          fr: "Pasta nature ou Mini pizza avec boisson au choix OU Burger ou nuggets + frite avec boisson au choix.",
          en: "Plain pasta or Mini pizza with drink of choice OR Burger or nuggets + fries with drink of choice.",
          de: "Natur-Pasta oder Mini-Pizza mit Getränk nach Wahl ODER Burger oder Nuggets + Pommes mit Getränk nach Wahl."
        },
        price: "58",
        image: "images/menu-enfant-plat.jpg"
      },
      {
        name: { fr: "ACCOMPAGNEMENTS", en: "SIDE DISHES", de: "BEILAGEN" },
        description: {
          fr: "2 Accompagnements au choix : Légumes sautés, riz, frites, purée pomme de terre, potatos.",
          en: "2 Side dishes of choice: Sautéed vegetables, rice, french fries, mashed potatoes, potato wedges.",
          de: "2 Beilagen nach Wahl: Gebratenes Gemüse, Reis, Pommes Frites, Kartoffelpüree, Kartoffelspalten."
        },
        price: "Inclus",
        image: "images/accompagnements.jpg"
      }
    ]
  },

  // =========================
  // COUSCOUS VENDREDI
  // =========================
  {
    category: {
      fr: "COUSCOUS VENDREDI",
      en: "FRIDAY COUSCOUS",
      de: "FREITAGS COUSCOUS"
    },
    items: [
      {
        name: { fr: "Couscous viande avec petit lait", en: "Meat couscous with buttermilk", de: "Fleisch-Couscous mit Buttermilch" },
        description: {
          fr: "Plat traditionnel servi le vendredi.",
          en: "Traditional dish served on Fridays.",
          de: "Traditionelles Gericht, das freitags serviert wird."
        },
        price: "64",
        image: "images/couscous-viande.jpg"
      },
      {
        name: { fr: "Couscous poulet avec petit lait", en: "Chicken couscous with buttermilk", de: "Hähnchen-Couscous mit Buttermilch" },
        description: {
          fr: "Plat traditionnel servi le vendredi.",
          en: "Traditional dish served on Fridays.",
          de: "Traditionelles Gericht, das freitags serviert wird."
        },
        price: "54",
        image: "images/couscous-poulet.jpg"
      }
    ]
  },

  // =========================
  // SANDWICHS CIABATTA
  // =========================
  {
    category: {
      fr: "SANDWICHS CIABATTA",
      en: "CIABATTA SANDWICHES",
      de: "CIABATTA SANDWICHES"
    },
    id: "sandwichs",
    items: [
      {
        name: { fr: "SANDWICH CHEESE STEAK", en: "CHEESE STEAK SANDWICH", de: "CHEESE STEAK SANDWICH" },
        description: {
          fr: "Steak grillé tendre, cheddar.",
          en: "Tender grilled steak, cheddar.",
          de: "Zartes gegrilltes Steak, Cheddar."
        },
        price: "65",
        image: "images/sand-cheesesteak.jpg"
      },
      {
        name: { fr: "FRUITS DE MER", en: "SEAFOOD", de: "MEERESFRÜCHTE" },
        description: {
          fr: "Crevette, Calamar, sauce du chef.",
          en: "Shrimp, Calamari, chef's sauce.",
          de: "Garnele, Tintenfisch, Soße des Chefkochs."
        },
        price: "65",
        image: "images/sand-fruitsmer.jpg"
      },
      {
        name: { fr: "POULARD", en: "Sliced chicken with mushroom", de: "Hühnerstreifen-Sandwich mit Champignons" },
        description: {
          fr: "Emincé de Poulet, cheddar, champignon, sauce blanche",
          en: "Sliced chicken, cheddar, mushroom, white sauce.",
          de: "Geschnetzeltes Hähnchen, Cheddar, Champignons, weiße Soße."
        },
        price: "54",
        image: "images/sand-cheesesteak.jpg",
isNew: true
      },
      {
        name: { fr: "POULET CRUNCHY", en: "CRUNCHY CHICKEN", de: "KNUSPRIGES HÄHNCHEN" },
        description: {
          fr: "Bâton de poulet pané, cheddar, laitue.",
          en: "Breaded chicken stick, cheddar, lettuce.",
          de: "Paniertes Hähnchenstäbchen, Cheddar, Salat."
        },
        price: "58",
        image: "images/sand-crunchy.jpg"
      },
      {
        name: { fr: "VIANDE HACHÉE", en: "MINCED MEAT", de: "HACKFLEISCH" },
        description: {
          fr: "Viande hachée, tomate, salade, sauce spéciale, cheddar.",
          en: "Minced meat, tomato, salad, special sauce, cheddar.",
          de: "Hackfleisch, Tomate, Salat, Spezialsoße, Cheddar."
        },
        price: "54",
        image: "images/sand-hache.jpg"
      },
      {
        name: { fr: "POULET", en: "CHICKEN", de: "HÄHNCHEN" },
        description: {
          fr: "Blanc de Poulet, cheddar, salade, tomate.",
          en: "Chicken breast, cheddar, salad, tomato.",
          de: "Hähnchenbrust, Cheddar, Salat, Tomate."
        },
        price: "48",
        image: "images/sand-poulet.jpg"
      },
      {
        name: { fr: "THON", en: "TUNA", de: "THUNFISCH" },
        description: {
          fr: "Thon, sauce burger, oignon, salade, tomate, cheddar.",
          en: "Tuna, burger sauce, onion, salad, tomato, cheddar.",
          de: "Thunfisch, Burgersoße, Zwiebel, Salat, Tomate, Cheddar."
        },
        price: "48",
        image: "images/sand-thon.jpg"
      }
    ]
  },

  // =========================
  // BURGERS
  // =========================
  {
    category: {
      fr: "BURGERS",
      en: "BURGERS",
      de: "BURGER"
    },
    id: "burgers",
    items: [
      {
        name: { fr: "CHICKEN BURGER", en: "CHICKEN BURGER", de: "Hähnchen-Burger" },
        description: {
          fr: "poulet assaisonnées, cheddar, laitue, tomate, oignon, cornichon, sauce biggy",
          en: "Seasoned chicken, cheddar, lettuce, tomato, onion, pickle, Biggy sauce.",
          de: "Gewürztes Hähnchen, Cheddar, Salat, Tomate, Zwiebel, Gurke, Biggy-Sauce."
        },
        price: "50",
        image: "images/burger-cheese.jpg",
isNew: true
      },
      {
        name: { fr: "BURGER ROYAL", en: "ROYAL BURGER", de: "ROYAL BURGER" },
        description: {
          fr: "Viande hachée, poulet pané, cheddar, oignons caramélisés, laitue, tomate, sauce spéciale.",
          en: "Minced meat, breaded chicken, cheddar, caramelized onions, lettuce, tomato, special sauce.",
          de: "Hackfleisch, paniertes Hähnchen, Cheddar, karamellisierte Zwiebeln, Salat, Tomate, Spezialsoße."
        },
        price: "70",
        image: "images/burger-royal.jpg"
      },
      {
        name: { fr: "BIG BURGER", en: "BIG BURGER", de: "BIG BURGER" },
        description: {
          fr: "2 viandes hachées, fromage cheddar, laitue, tomate, oignon, sauce du chef.",
          en: "2 minced meats, cheddar cheese, lettuce, tomato, onion, chef's sauce.",
          de: "2 Hackfleischpatties, Cheddar-Käse, Salat, Tomate, Zwiebel, Soße des Chefkochs."
        },
        price: "68",
        image: "images/burger-big.jpg"
      },
      {
        name: { fr: "EGG ET CHEESEBURGER", en: "EGG AND CHEESEBURGER", de: "EI UND CHEESEBURGER" },
        description: {
          fr: "Viande hachée, cheddar, champignon, œuf, laitue, tomate, oignon caramélisé.",
          en: "Minced meat, cheddar, mushroom, egg, lettuce, tomato, caramelized onion.",
          de: "Hackfleisch, Cheddar, Pilz, Ei, Salat, Tomate, karamellisierte Zwiebel."
        },
        price: "56",
        image: "images/burger-eggcheese.jpg"
      },
      {
        name: { fr: "CHEESE BURGER", en: "CHEESE BURGER", de: "CHEESE BURGER" },
        description: {
          fr: "Viande hachée, cheddar, laitue, tomate, oignon, cornichon, sauce burger.",
          en: "Minced meat, cheddar, lettuce, tomato, onion, pickle, burger sauce.",
          de: "Hackfleisch, Cheddar, Salat, Tomate, Zwiebel, Gurke, Burgersoße."
        },
        price: "54",
        image: "images/burger-cheese.jpg"
      },
      {
        name: { fr: "AVOCADO FORESTIER", en: "AVOCADO FORESTIER", de: "AVOCADO FORESTER" },
        description: {
          fr: "Poulet, avocat, laitue, tomate, oignon caramélisé.",
          en: "Chicken, avocado, lettuce, tomato, caramelized onion.",
          de: "Hähnchen, Avocado, Salat, Tomate, karamellisierte Zwiebel."
        },
        price: "54",
        image: "images/burger-avocado.jpg"
      }
    ]
  },

  // =========================
  // PANINI
  // =========================
  {
    category: {
      fr: "PANINI",
      en: "PANINI",
      de: "PANINI"
    },
    id: "panini",
    items: [
      {
        name: { fr: "FRUIT DE MER", en: "SEAFOOD", de: "MEERESFRÜCHTE" },
        description: {
          fr: "Crevettes, calamars, sauce de chef.",
          en: "Shrimp, calamari, chef's sauce.",
          de: "Garnelen, Tintenfisch, Soße des Chefkochs."
        },
        price: "64",
        image: "images/panini-fruitsmer.jpg"
      },
      {
        name: { fr: "SAUMON", en: "SALMON", de: "LACHS" },
        description: {
          fr: "Saumon frais, capre, fromage, sauce du chef.",
          en: "Fresh salmon, caper, cheese, chef's sauce.",
          de: "Frischer Lachs, Kapern, Käse, Soße des Chefkochs."
        },
        price: "64",
        image: "images/panini-saumon.jpg"
      },
      {
        name: { fr: "MIXTE ", en: " MIX", de: "MIX" },
        description: {
          fr: "Mélange de viande hachée et poulet, charcuterie, fromage.",
          en: "Mix of minced meat and chicken, cold cuts, cheese.",
          de: "Mischung aus Hackfleisch und Hähnchen, Aufschnitt, Käse."
        },
        price: "58",
        image: "images/panini-mixte.jpg"
      },
      {
        name: { fr: "VIANDE HACHÉE", en: "MINCED MEAT", de: "HACKFLEISCH" },
        description: {
          fr: "Viande hachée, fromage, sauce burger.",
          en: "Minced meat, cheese, burger sauce.",
          de: "Hackfleisch, Käse, Burgersoße."
        },
        price: "54",
        image: "images/panini-hache.jpg"
      },
      {
        name: { fr: "CHARCUTERIE", en: "COLD CUTS", de: "AUFSCHNITT" },
        description: {
          fr: "3 Charcuteries, salami, fromage, sauce burger.",
          en: "3 Cold cuts, salami, cheese, burger sauce.",
          de: "3 Sorten Aufschnitt, Salami, Käse, Burgersoße."
        },
        price: "40",
        image: "images/panini-charcuterie.jpg"
      },
      {
        name: { fr: "POULET", en: "CHICKEN", de: "HÄHNCHEN" },
        description: {
          fr: "Poulet grillé, fromage, sauce burger.",
          en: "Grilled chicken, cheese, burger sauce.",
          de: "Gegrilltes Hähnchen, Käse, Burgersoße."
        },
        price: "44",
        image: "images/panini-poulet.jpg"
      },
{
        name: { fr: "WRAP POULET", en: "WRAP CHICKEN", de: "WRAP HÄHNCHEN" },
        description: {
          fr: "poulet pané, , cheddar ,tomate, laitue ,sauce",
          en: "Breaded chicken, cheddar, tomato, lettuce, sauce.",
          de: "Panierter Hähnchen, Cheddar, Tomate, Salat, Sauce."
        },
        price: "58",
        image: "images/wrap-poulet.jpg",
isNew: true
      },
 {
        name: { fr: "WRAP VIANDE HACHÉE", en: "WRAP MINCED MEAT", de: "WRAP HACKFLEISCH" },
        description: {
          fr: "Viande hachee, cheddar ,tomate, laitue ,sauce",
          en: "Ground beef, cheddar, tomato, lettuce, sauce.",
          de: "Hackfleisch, Cheddar, Tomate, Salat, Sauce."
        },
        price: "62",
        image: "images/wrap-viande-hachee.jpg",
isNew: true
      },
 {
        name: { fr: "WRAP GOURMAND ", en: " Gourmet wrap", de: "Gourmet wrap" },
        description: {
          fr: "poulet pané, charcuterie, cheddar ,tomate, laitue ,sauce.",
          en: "Breaded chicken, charcuterie, cheddar, tomato, lettuce, sauce.",
          de: "Panierter Hähnchen, Wurstwaren, Cheddar, Tomate, Salat, Sauce."
        },
        price: "64",
        image: "images/wrap-gourmand.jpg",
isNew: true
      }

    ]
  },

  // =========================
  // PIZZA
  // =========================
  {
    category: {
      fr: "PIZZA",
      en: "PIZZA",
      de: "PIZZA"
    },
    id: "pizza",
    items: [
      {
        name: { fr: "SAUMON", en: "SALMON", de: "LACHS" },
        description: {
          fr: "Saumon frais, Sauce blanche, roquette, câpre.",
          en: "Fresh salmon, white sauce, arugula, caper.",
          de: "Frischer Lachs, weiße Soße, Rucola, Kapern."
        },
        price: "94",
        image: "images/pizza-saumon.jpg"
      },
      {
        name: { fr: "FRUITS DE MER", en: "SEAFOOD", de: "MEERESFRÜCHTE" },
        description: {
          fr: "Crevettes, calamars, moules, champignon, sauce blanche, mozzarella.",
          en: "Shrimp, calamari, mussels, mushroom, white sauce, mozzarella.",
          de: "Garnelen, Tintenfisch, Muscheln, Pilz, weiße Soße, Mozzarella."
        },
        price: "88",
        image: "images/pizza-fruitsmer.jpg"
      },
      {
        name: { fr: "4 SAISONS", en: "4 SEASONS", de: "4 JAHRESZEITEN" },
        description: {
          fr: "Fruit de mer, viande hachée, poulet, végétarienne, mozzarella.",
          en: "Seafood, minced meat, chicken, vegetarian, mozzarella.",
          de: "Meeresfrüchte, Hackfleisch, Hähnchen, Vegetarisch, Mozzarella."
        },
        price: "88",
        image: "images/pizza-4saisons.jpg"
      },
      {
        name: { fr: "MOITIÉ MOITIÉ", en: "HALF AND HALF", de: "HALB UND HALB" },
        description: {
          fr: "Tout sauf fruits de mer et saumon.",
          en: "Everything except seafood and salmon.",
          de: "Alles außer Meeresfrüchten und Lachs."
        },
        price: "88",
        image: "images/pizza-moitiemoitie.jpg"
      },
      {
        name: { fr: "BURRATA", en: "BURRATA", de: "BURRATA" },
        description: {
          fr: "Sauce tomate, burrata, tomates cerises, roquette, vinaigre balsamique, noix.",
          en: "Tomato sauce, burrata, cherry tomatoes, arugula, balsamic vinegar, walnuts.",
          de: "Tomatensoße, Burrata, Kirschtomaten, Rucola, Balsamico-Essig, Walnüsse."
        },
        price: "110",
        image: "images/pizza-burrata.jpg"
      },
      {
        name: { fr: "POULET SAUCE BLANCHE", en: "CHICKEN WHITE SAUCE", de: "HÄHNCHEN WEISSE SOßE" },
        description: {
          fr: "Poulet, sauce blanche, champignon, mozzarella.",
          en: "Chicken, white sauce, mushroom, mozzarella.",
          de: "Hähnchen, weiße Soße, Pilz, Mozzarella."
        },
        price: "78",
        image: "images/pizza-pouletblanche.jpg"
      },
      {
        name: { fr: "5 FROMAGES", en: "5 CHEESES", de: "5 KÄSE" },
        description: {
          fr: "Sauce tomate, mozzarella, bleu, parmesan, gouda, camembert.",
          en: "Tomato sauce, mozzarella, blue cheese, parmesan, gouda, camembert.",
          de: "Tomatensoße, Mozzarella, Blauschimmelkäse, Parmesan, Gouda, Camembert."
        },
        price: "78",
        image: "images/pizza-5fromages.jpg"
      },
      {
        name: { fr: "VIANDE HACHÉE", en: "MINCED MEAT", de: "HACKFLEISCH" },
        description: {
          fr: "Viande hachée, tomate cerise, sauce tomate, mozzarella.",
          en: "Minced meat, cherry tomato, tomato sauce, mozzarella.",
          de: "Hackfleisch, Kirschtomate, Tomatensoße, Mozzarella."
        },
        price: "78",
        image: "images/pizza-hache.jpg"
      },
      {
        name: { fr: "PEPPERONI", en: "PEPPERONI", de: "PEPPERONI" },
        description: {
          fr: "Peppéroni, Sauce tomate, mozzarella.",
          en: "Pepperoni, tomato sauce, mozzarella.",
          de: "Pepperoni, Tomatensoße, Mozzarella."
        },
        price: "74",
        image: "images/pizza-pepperoni.jpg"
      },
      {
        name: { fr: "REGINA", en: "REGINA", de: "REGINA" },
        description: {
          fr: "Dinde fumée, champignon frais, mozzarella, sauce blanche.",
          en: "Smoked turkey, fresh mushroom, mozzarella, white sauce.",
          de: "Geräucherte Pute, frischer Pilz, Mozzarella, weiße Soße."
        },
        price: "68",
        image: "images/pizza-regina.jpg"
      },
      {
        name: { fr: "THON", en: "TUNA", de: "THUNFISCH" },
        description: {
          fr: "Thon, oignons, olives noires, mozzarella.",
          en: "Tuna, onions, black olives, mozzarella.",
          de: "Thunfisch, Zwiebeln, schwarze Oliven, Mozzarella."
        },
        price: "65",
        image: "images/pizza-thon.jpg"
      },
      {
        name: { fr: "VEGETARIENNE", en: "VEGETARIAN", de: "VEGETARISCH" },
        description: {
          fr: "Légumes variés (poivrons, champignons, oignons, courgettes), sauce pesto, mozzarella.",
          en: "Assorted vegetables (peppers, mushrooms, onions, zucchini), pesto sauce, mozzarella.",
          de: "Verschiedenes Gemüse (Paprika, Pilze, Zucchini), Pesto-Soße, Mozzarella."
        },
        price: "62",
        image: "images/pizza-veggie.jpg"
      },
      {
        name: { fr: "MARGARITA", en: "MARGARITA", de: "MARGARITA" },
        description: {
          fr: "Sauce tomate, basilic, olives noires, mozzarella.",
          en: "Tomato sauce, basil, black olives, mozzarella.",
          de: "Tomatensoße, Basilikum, schwarze Oliven, Mozzarella."
        },
        price: "52",
        image: "images/pizza-margherita.jpg"
      }
    ]
  },

  // =========================
  // PASTA
  // =========================
  {
    category: {
      fr: "Pasta (Spaghettis, Tagliatelles, Linguines)",
      en: "Pasta (Spaghetti, Tagliatelle, Linguine)",
      de: "Pasta (Spaghetti, Tagliatelle, Linguine)"
    },
    id: "pasta",
    items: [
      {
        name: { fr: "SAUMON", en: "SALMON", de: "LACHS" },
        description: {
          fr: "Pâtes, saumon frais, aneth, parmesan.",
          en: "Pasta, fresh salmon, dill, parmesan.",
          de: "Pasta, frischer Lachs, Dill, Parmesan."
        },
        price: "98",
        image: "images/pasta-saumon.jpg"
      },
      {
        name: { fr: "FRUITS DE MER", en: "SEAFOOD", de: "MEERESFRÜCHTE" },
        description: {
          fr: "Pâtes, crevettes, calamars, moules, sauce blanche.",
          en: "Pasta, shrimp, calamari, mussels, white sauce.",
          de: "Pasta, Garnelen, Tintenfisch, Muscheln, weiße Soße."
        },
        price: "88",
        image: "images/pasta-fruitsmer.jpg"
      },
      {
        name: { fr: "POULET CHAMPIGNON / EPINARD", en: "CHICKEN MUSHROOM / SPINACH", de: "HÄHNCHEN PILZ / SPINAT" },
        description: {
          fr: "Pâtes, poulet, champignon, épinard, parmesan.",
          en: "Pasta, chicken, mushroom, spinach, parmesan.",
          de: "Pasta, Hähnchen, Pilz, Spinat, Parmesan."
        },
        price: "75",
        image: "images/pasta-poulet.jpg"
      },
      {
        name: { fr: "REGATONI RICOTTA", en: "RICOTTA REGATONI", de: "RICOTTA REGATONI" },
        description: {
          fr: "Ricotta, épinard, parmesan, courgette, sauce blanche.",
          en: "Ricotta, spinach, parmesan, zucchini, white sauce.",
          de: "Ricotta, Spinat, Parmesan, Zucchini, weiße Soße."
        },
        price: "68",
        image: "images/pasta-ricotta.jpg"
      },
      {
        name: { fr: "BOLOGNAISE", en: "BOLOGNESE", de: "BOLOGNESE" },
        description: {
          fr: "Pâtes, sauce bolognaise à la viande hachée, tomate cerise.",
          en: "Pasta, Bolognese sauce with minced meat, cherry tomato.",
          de: "Pasta, Bolognese-Soße mit Hackfleisch, Kirschtomate."
        },
        price: "75",
        image: "images/pasta-bolognaise.jpg"
      },
      {
        name: { fr: "CARBONARA", en: "CARBONARA", de: "CARBONARA" },
        description: {
          fr: "Pâtes, jambon dinde, parmesan.",
          en: "Pasta, turkey ham, parmesan.",
          de: "Pasta, Putenschinken, Parmesan."
        },
        price: "65",
        image: "images/pasta-carbonara.jpg"
      },
      {
        name: { fr: "5 FROMAGE", en: "5 CHEESES", de: "5 KÄSE" },
        description: {
          fr: "Pâtes, mélange de cinq fromages (parmesan, bleu, mozzarella, cheddar, gouda).",
          en: "Pasta, blend of five cheeses (parmesan, blue, mozzarella, cheddar, gouda).",
          de: "Pasta, Mischung aus fünf Käsesorten (Parmesan, Blau, Mozzarella, Cheddar, Gouda)."
        },
        price: "70",
        image: "images/pasta-5fromages.jpg"
      },
      {
        name: { fr: "VEGETARIEN", en: "VEGETARIAN", de: "VEGETARISCH" },
        description: {
          fr: "Pâtes, légumes variés (courgettes, poivrons, tomates), sauce pesto, huile d'olive.",
          en: "Pasta, assorted vegetables (zucchini, peppers, tomatoes), pesto sauce, olive oil.",
          de: "Pasta, verschiedenes Gemüse (Zucchini, Paprika, Tomaten), Pesto-Soße, Olivenöl."
        },
        price: "60",
        image: "images/pasta-veg.jpg"
      },
      {
        name: { fr: "SPAGHETTIS NOIRS", en: "BLACK SPAGHETTI", de: "SCHWARZE SPAGHETTI" },
        description: {
          fr: "Supplément pour pâtes noires à l'encre de seiche.",
          en: "Supplement for black pasta with squid ink.",
          de: "Zuschlag für schwarze Pasta mit Tintenfischtinte."
        },
        price: "5",
        image: "images/pasta-noir.jpg"
      },
 {
        name: { fr: "LASAGNE POULET CHAMPIGNON ", en: "CHICKEN MUSHROOM LASAGNE", de: "Lasagne mit Hähnchen und Champignons " },
        description: {
          fr: "Poulet, Pâtes lasagne, Sauce blanche, Béchamel, fromage",
          en: "Chicken, lasagne pasta, white sauce, béchamel, cheese.",
          de: "Hähnchen, Lasagne-Nudeln, weiße Sauce, Béchamelsauce, Käse"
        },
        price: "60",
        image: "images/lasagne-poulet.jpg",
isNew: true
      },
{
        name: { fr: "LASAGNE BOLOGNAISE ", en: "Bolognese lasagne.", de: "Bolognese lasagne " },
        description: {
          fr: "Viande hachée, Pâtes lasagne, Sauce bolognaise, Béchamel, fromage",
          en: "Ground beef, lasagne pasta, Bolognese sauce, béchamel, cheese.",
          de: "Hackfleisch, Lasagne-Nudeln, Bolognese-Sauce, Béchamelsauce, Käse."
        },
        price: "72",
        image: "images/lasagne-viande.jpg",
isNew: true
      },
{
        name: { fr: "LASAGNE FRUIT DE MER ", en: "Seafood lasagne", de: "Meeresfrüchte-Lasagne" },
        description: {
          fr: "Crevette, calamars, , Pâtes lasagne, Sauce blanche, Béchamel, fromage",
          en: "Shrimp, squid, lasagne pasta, white sauce, béchamel, cheese.",
          de: "Garnelen, Kalmar, Lasagne-Nudeln, weiße Sauce, Béchamelsauce, Käse"
        },
        price: "78",
        image: "images/Lasagnes-de-fruits-de-mer.jpg",
isNew: true
      }
    ]
  },

  // =========================
  // CRÊPES et GAUFRES
  // =========================
  {
    category: {
      fr: "CRÊPES et GAUFRES",
      en: "CRÊPES and WAFFLES",
      de: "CRÊPES und WAFFELN"
    },
    id: "crepes",
    items: [
      {
        name: { fr: "GREY CORNER (variétés gourmandises)", en: "GREY CORNER (gourmet varieties)", de: "GREY CORNER (Gourmet-Sorten)" },
        description: {
          fr: "Crêpe ou gaufre avec des variétés gourmandes.",
          en: "Crêpe or waffle with gourmet varieties.",
          de: "Crêpe oder Waffel mit Gourmet-Sorten."
        },
        price: "52",
        image: "images/crepe-gc.jpg"
      },
      {
        name: { fr: "EXOTIQUE (fruits saisons)", en: "EXOTIC (seasonal fruits)", de: "EXOTISCH (saisonale Früchte)" },
        description: {
          fr: "Crêpe ou gaufre aux fruits de saison.",
          en: "Crêpe or waffle with seasonal fruits.",
          de: "Crêpe oder Waffel mit saisonalen Früchten."
        },
        price: "48",
        image: "images/crepe-exotique.jpg"
      },
      {
        name: { fr: "KUNAFA PISTACHE", en: "PISTACHIO KUNAFA", de: "PISTAZIEN KUNAFA" },
        description: {
          fr: "Crêpe ou gaufre saveur Kunafa pistache.",
          en: "Crêpe or waffle with Kunafa pistachio flavor.",
          de: "Crêpe oder Waffel mit Kunafa Pistazien-Geschmack."
        },
        price: "48",
        image: "images/crepe-kunafa.jpg"
      },
      {
        name: { fr: "BANANE-NUTELLA", en: "BANANA-NUTELLA", de: "BANANE-NUTELLA" },
        description: {
          fr: "Crêpe ou gaufre à la banane et Nutella.",
          en: "Crêpe or waffle with banana and Nutella.",
          de: "Crêpe oder Waffel mit Banane und Nutella."
        },
        price: "42",
        image: "images/crepe-bananenutella.jpg"
      },
      {
        name: { fr: "POMME CARAMELISÉE", en: "CARAMELIZED APPLE", de: "KARAMELLISIERTER APFEL" },
        description: {
          fr: "Crêpe ou gaufre à la pomme caramélisée.",
          en: "Crêpe or waffle with caramelized apple.",
          de: "Crêpe oder Waffel mit karamellisiertem Apfel."
        },
        price: "40",
        image: "images/crepe-pomme.jpg"
      },
      {
        name: { fr: "CHOCOLAT NOISETTE", en: "HAZELNUT CHOCOLATE", de: "HASELNUSS-SCHOKOLADE" },
        description: {
          fr: "Crêpe ou gaufre au chocolat noisette.",
          en: "Crêpe or waffle with hazelnut chocolate.",
          de: "Crêpe oder Waffel mit Haselnuss-Schokolade."
        },
        price: "42",
        image: "images/crepe-noisette.jpg"
      },
      {
        name: { fr: "NUTELLA", en: "NUTELLA", de: "NUTELLA" },
        description: {
          fr: "Crêpe ou gaufre au Nutella.",
          en: "Crêpe or waffle with Nutella.",
          de: "Crêpe oder Waffel mit Nutella."
        },
        price: "38",
        image: "images/crepe-nutella.jpg"
      }
    ]
  },

  // =========================
  // CRÊPES SALÉES
  // =========================
  {
    category: {
      fr: "CRÊPES SALÉES",
      en: "SAVORY CRÊPES",
      de: "HERZHAFTE CRÊPES"
    },
    items: [
      {
        name: { fr: "Crêpe PÊCHEUR", en: "FISHERMAN'S Crêpe", de: "FISCHER Crêpe" },
        description: {
          fr: "Crêpe salée aux fruits de mer.",
          en: "Savory crêpe with seafood.",
          de: "Herzhafter Crêpe mit Meeresfrüchten."
        },
        price: "58",
        image: "images/crepe-sal-pecheur.jpg"
      },
      {
        name: { fr: "Crêpe NORVÉGIENNE", en: "NORWEGIAN Crêpe", de: "NORWEGISCHER Crêpe" },
        description: {
          fr: "Crêpe salée au saumon.",
          en: "Savory crêpe with salmon.",
          de: "Herzhafter Crêpe mit Lachs."
        },
        price: "58",
        image: "images/crepe-sal-norve.jpg"
      },
      {
        name: { fr: "Crêpe GREY CORNER (MIXTE)", en: "GREY CORNER Crêpe (MIXED)", de: "GREY CORNER Crêpe (GEMISCHT)" },
        description: {
          fr: "Crêpe salée mixte (viande et fromage).",
          en: "Mixed savory crêpe (meat and cheese).",
          de: "Gemischter herzhafter Crêpe (Fleisch und Käse)."
        },
        price: "58",
        image: "images/crepe-sal-gc.jpg"
      },
      {
        name: { fr: "Crêpe BOLOGNAISE", en: "BOLOGNESE Crêpe", de: "BOLOGNESE Crêpe" },
        description: {
          fr: "Crêpe salée à la sauce bolognaise.",
          en: "Savory crêpe with Bolognese sauce.",
          de: "Herzhafter Crêpe mit Bolognese-Soße."
        },
        price: "54",
        image: "images/crepe-sal-bologn.jpg"
      },
      {
        name: { fr: "Crêpe POULET-CHAMPIGNON", en: "CHICKEN-MUSHROOM Crêpe", de: "HÄHNCHEN-PILZ Crêpe" },
        description: {
          fr: "Crêpe salée au poulet et champignons.",
          en: "Savory crêpe with chicken and mushrooms.",
          de: "Herzhafter Crêpe mit Hähnchen und Pilzen."
        },
        price: "48",
        image: "images/crepe-sal-poulet.jpg"
      },
      {
        name: { fr: "Crêpe CHARCUTERIE", en: "COLD CUTS Crêpe", de: "AUFSCHNITT Crêpe" },
        description: {
          fr: "Crêpe salée à la charcuterie.",
          en: "Savory crêpe with cold cuts.",
          de: "Herzhafter Crêpe mit Aufschnitt."
        },
        price: "45",
        image: "images/crepe-sal-charcut.jpg"
      },
      {
        name: { fr: "Crêpe FROMAGE", en: "CHEESE Crêpe", de: "KÄSE Crêpe" },
        description: {
          fr: "Crêpe salée au fromage.",
          en: "Savory crêpe with cheese.",
          de: "Herzhafter Crêpe mit Käse."
        },
        price: "45",
        image: "images/crepe-sal-fromage.jpg"
      }
    ]
  },

  // =========================
  // GÂTEAUX
  // =========================
  {
    category: {
      fr: "GÂTEAUX",
      en: "DESSERTS / CAKES",
      de: "KUCHEN / DESSERTS"
    },
    id: "gateaux",
    items: [
      {
        name: { fr: "SAN SEBASTIEN", en: "SAN SEBASTIEN", de: "SAN SEBASTIEN" },
        description: {
          fr: "Parfums : fruits rouge, caramel, pistache, chocolat noir, miel.",
          en: "Flavors: red fruits, caramel, pistachio, dark chocolate, honey.",
          de: "Geschmacksrichtungen: rote Früchte, Karamell, Pistazie, dunkle Schokolade, Honig."
        },
        price: "45",
        image: "images/gateau-sanseb-vari.jpg"
      },
      {
        name: { fr: "CHEESECAKE (Chocolat, Pistache, Framboise)", en: "CHEESECAKE (Chocolate, Pistachio, Raspberry)", de: "CHEESECAKE (Schokolade, Pistazie, Himbeere)" },
        description: {
          fr: "Cheesecake gourmand aux parfums chocolat, pistache et framboise.",
          en: "Delicious cheesecake with chocolate, pistachio and raspberry flavors.",
          de: "Leckerer Käsekuchen mit Schokolade-, Pistazien- und Himbeergeschmack."
        },
        price: "45",
        image: "images/gateau-cheesecake-choco.jpg"
      },
      {
        name: { fr: "FONDANT AU CHOCOLAT", en: "CHOCOLATE FONDANT", de: "SCHOKOLADEN-FONDANT" },
        description: {
          fr: "Servi avec boule vanille.",
          en: "Served with vanilla scoop.",
          de: "Serviert mit Vanillekugel."
        },
        price: "40",
        image: "images/gateau-fondant.jpg"
      },
      {
        name: { fr: "SAN SEBASTIEN (Nutella)", en: "SAN SEBASTIEN (Nutella)", de: "SAN SEBASTIEN (Nutella)" },
        description: {
          fr: "Cheesecake basque au Nutella.",
          en: "Basque cheesecake with Nutella.",
          de: "Baskischer Käsekuchen mit Nutella."
        },
        price: "40",
        image: "images/gateau-sanseb-nutella.jpg"
      },
      {
        name: { fr: "CHEESECAKE (Lotus, Citron)", en: "CHEESECAKE (Lotus, Lemon)", de: "CHEESECAKE (Lotus, Zitrone)" },
        description: {
          fr: "Cheesecake crémeux aux saveurs Lotus et Citron.",
          en: "Creamy cheesecake with Lotus and Lemon flavors.",
          de: "Cremiger Käsekuchen mit Lotus- und Zitronengeschmack."
        },
        price: "40",
        image: "images/gateau-cheesecake-lotus.jpg"
      },
      {
        name: { fr: "TIRAMISU", en: "TIRAMISU", de: "TIRAMISU" },
        description: {
          fr: "Dessert classique italien.",
          en: "Classic Italian dessert.",
          de: "Klassisches italienisches Dessert."
        },
        price: "38",
        image: "images/gateau-tiramisu.jpg"
      }
    ]
  },

  // =========================
  // BOISSONS CHAUDES
  // =========================
  {
    category: {
      fr: "BOISSONS CHAUDES",
      en: "HOT DRINKS",
      de: "HEISSE GETRÄNKE"
    },
    items: [
      {
        name: { fr: "CHOCOLAT FONDUE", en: "CHOCOLATE FONDUE", de: "SCHOKOLADEN-FONDUE" },
        description: {
          fr: "Chocolat fondu riche.",
          en: "Rich melted chocolate.",
          de: "Reiche geschmolzene Schokolade."
        },
        price: "26",
        image: "images/boisson-choc-fondue.jpg"
      },
      {
        name: { fr: "CAFÉ NESPRESSO", en: "NESPRESSO COFFEE", de: "NESPRESSO KAFFEE" },
        description: {
          fr: "Servi avec une eau minérale 33 cl.",
          en: "Served with a 33 cl mineral water.",
          de: "Serviert mit einem 33 cl Mineralwasser."
        },
        price: "22",
        image: "images/boisson-nespresso.jpg"
      },
      {
        name: { fr: "CAPPUCHINO AVEC CHANTILLY", en: "CAPPUCCINO WITH WHIPPED CREAM", de: "CAPPUCCINO MIT SCHLAGSAHNE" },
        description: {
          fr: "Servi avec une eau minérale 33 cl.",
          en: "Served with a 33 cl mineral water.",
          de: "Serviert mit einem 33 cl Mineralwasser."
        },
        price: "22",
        image: "images/boisson-cappu-chant.jpg"
      },
      {
        name: { fr: "CHOCOLAT AVEC CHANTILLY", en: "CHOCOLATE WITH WHIPPED CREAM", de: "SCHOKOLADE MIT SCHLAGSAHNE" },
        description: {
          fr: "Servi avec une eau minérale 33 cl.",
          en: "Served with a 33 cl mineral water.",
          de: "Serviert mit einem 33 cl Mineralwasser."
        },
        price: "22",
        image: "images/boisson-choc-chant.jpg"
      },
      {
        name: { fr: "CAFÉ AU LAIT", en: "COFFEE WITH MILK", de: "KAFFEE MIT MILCH" },
        description: {
          fr: "Servi avec une eau minérale 33 cl.",
          en: "Served with a 33 cl mineral water.",
          de: "Serviert mit einem 33 cl Mineralwasser."
        },
        price: "19",
        image: "images/boisson-cafelait.jpg"
      },
      {
        name: { fr: "CAPPUCHINO ITALIEN", en: "ITALIAN CAPPUCCINO", de: "ITALIENISCHER CAPPUCCINO" },
        description: {
          fr: "Servi avec une eau minérale 33 cl.",
          en: "Served with a 33 cl mineral water.",
          de: "Serviert mit einem 33 cl Mineralwasser."
        },
        price: "19",
        image: "images/boisson-cappu.jpg"
      },
      {
        name: { fr: "CHOCOLAT AU LAIT", en: "HOT CHOCOLATE", de: "HEISSE SCHOKOLADE" },
        description: {
          fr: "Servi avec une eau minérale 33 cl.",
          en: "Served with a 33 cl mineral water.",
          de: "Serviert mit einem 33 cl Mineralwasser."
        },
        price: "18",
        image: "images/boisson-chocolat.jpg"
      },
      {
        name: { fr: "CAFÉ LATTE", en: "CAFE LATTE", de: "CAFÉ LATTE" },
        description: {
          fr: "Servi avec une eau minérale 33 cl.",
          en: "Served with a 33 cl mineral water.",
          de: "Serviert mit einem 33 cl Mineralwasser."
        },
        price: "19",
        image: "images/boisson-cafelatte.jpg"
      },
      {
        name: { fr: "THÉ NOIR AU LAIT", en: "BLACK TEA WITH MILK", de: "SCHWARZER TEE MIT MILCH" },
        description: {
          fr: "Thé noir servi avec du lait.",
          en: "Black tea served with milk.",
          de: "Schwarzer Tee serviert mit Milch."
        },
        price: "18",
        image: "images/boisson-thenoir-lait.jpg"
      },
      {
        name: { fr: "THÉ INFUSION", en: "INFUSION TEA", de: "KRÄUTERTEE" },
        description: {
          fr: "Sélection d'infusions.",
          en: "Selection of infusions.",
          de: "Auswahl an Kräutertees."
        },
        price: "18",
        image: "images/boisson-infusion.jpg"
      },
      {
        name: { fr: "VERVEINE AROMATISÉE", en: "FLAVORED VERBENA", de: "AROMATISIERTE VERBENA" },
        description: {
          fr: "Infusion de verveine aromatisée.",
          en: "Flavored verbena infusion.",
          de: "Aromatisierter Eisenkraut-Aufguss."
        },
        price: "18",
        image: "images/boisson-verveine-arom.jpg"
      },
      {
        name: { fr: "CAFÉ AMERICAIN", en: "AMERICAN COFFEE", de: "AMERICANO" },
        description: {
          fr: "Servi avec une eau minérale 33 cl.",
          en: "Served with a 33 cl mineral water.",
          de: "Serviert mit einem 33 cl Mineralwasser."
        },
        price: "17",
        image: "images/boisson-americano.jpg"
      },
      {
        name: { fr: "CAFÉ NOIR", en: "BLACK COFFEE", de: "SCHWARZER KAFFEE" },
        description: {
          fr: "Servi avec une eau minérale 33 cl.",
          en: "Served with a 33 cl mineral water.",
          de: "Serviert mit einem 33 cl Mineralwasser."
        },
        price: "16",
        image: "images/boisson-cafe.jpg"
      },
      {
        name: { fr: "THÉ À LA MENTHE", en: "MINT TEA", de: "MINZTEE" },
        description: {
          fr: "Thé traditionnel à la menthe.",
          en: "Traditional mint tea.",
          de: "Traditioneller Minztee."
        },
        price: "16",
        image: "images/boisson-the.jpg"
      },
      {
        name: { fr: "THÉ NOIR", en: "BLACK TEA", de: "SCHWARZER TEE" },
        description: {
          fr: "Thé noir nature.",
          en: "Plain black tea.",
          de: "Purer schwarzer Tee."
        },
        price: "15",
        image: "images/boisson-thenoir.jpg"
      },
      {
        name: { fr: "VERVEINE", en: "VERBENA", de: "VERBENA" },
        description: {
          fr: "Infusion de verveine.",
          en: "Verbena infusion.",
          de: "Eisenkraut-Aufguss."
        },
        price: "15",
        image: "images/boisson-verveine.jpg"
      },
      {
        name: { fr: "LAIT FROID / CHAUD", en: "COLD / HOT MILK", de: "KALTE / WARME MILCH" },
        description: {
          fr: "Lait nature.",
          en: "Plain milk.",
          de: "Normale Milch."
        },
        price: "12",
        image: "images/boisson-lait.jpg"
      }
    ]
  },

  // =========================
  // SODA
  // =========================
  {
    category: {
      fr: "SODA",
      en: "SODA",
      de: "SODA"
    },
    items: [
      {
        name: { fr: "REDBULL", en: "REDBULL", de: "REDBULL" },
        description: {
          fr: "Boisson énergisante.",
          en: "Energy drink.",
          de: "Energy-Drink."
        },
        price: "28",
        image: "images/soda-redbull.jpg"
      },
      {
        name: { fr: "COCA", en: "COKE", de: "COCA" },
        description: {
          fr: "Boisson gazeuse.",
          en: "Fizzy drink.",
          de: "Sprudelgetränk."
        },
        price: "17",
        image: "images/soda-coca.jpg"
      },
      {
        name: { fr: "COCA ZERO", en: "COKE ZERO", de: "COCA ZERO" },
        description: {
          fr: "Boisson gazeuse sans sucre.",
          en: "Sugar-free fizzy drink.",
          de: "Zuckerfreies Sprudelgetränk."
        },
        price: "17",
        image: "images/soda-cocazero.jpg"
      },
      {
        name: { fr: "SPRITE", en: "SPRITE", de: "SPRITE" },
        description: {
          fr: "Boisson gazeuse.",
          en: "Fizzy drink.",
          de: "Sprudelgetränk."
        },
        price: "17",
        image: "images/soda-sprite.jpg"
      },
      {
        name: { fr: "HAWAI", en: "HAWAI", de: "HAWAI" },
        description: {
          fr: "Boisson gazeuse.",
          en: "Fizzy drink.",
          de: "Sprudelgetränk."
        },
        price: "17",
        image: "images/soda-hawai.jpg"
      },
      {
        name: { fr: "POMS", en: "POMS", de: "POMS" },
        description: {
          fr: "Boisson gazeuse.",
          en: "Fizzy drink.",
          de: "Sprudelgetränk."
        },
        price: "17",
        image: "images/soda-poms.jpg"
      },
      {
        name: { fr: "ORANGINA", en: "ORANGINA", de: "ORANGINA" },
        description: {
          fr: "Boisson gazeuse.",
          en: "Fizzy drink.",
          de: "Sprudelgetränk."
        },
        price: "17",
        image: "images/soda-orangina.jpg"
      },
      {
        name: { fr: "SCHWEPPES CITRON/TONIC", en: "SCHWEPPES LEMON/TONIC", de: "SCHWEPPES ZITRONE/TONIC" },
        description: {
          fr: "Boisson gazeuse.",
          en: "Fizzy drink.",
          de: "Sprudelgetränk."
        },
        price: "17",
        image: "images/soda-schweppes.jpg"
      }
    ]
  },

  // =========================
  // EAU MINÉRALE
  // =========================
  {
    category: {
      fr: "EAU MINÉRALE",
      en: "MINERAL WATER",
      de: "MINERALWASSER"
    },
    items: [
      {
        name: { fr: "OULMES 0.75 l", en: "OULMES (Sparkling)0.75 l", de: "OULMES (Sprudel)0.75 l" },
        description: {
          fr: "Eau minérale gazeuse.",
          en: "Sparkling mineral water.",
          de: "Sprudelndes Mineralwasser."
        },
        price: "26",
        image: "images/eau-oulmes75cl.jpg"
      },
      {
        name: { fr: "0.75 l", en: "0.75 l", de: "0.75 l" },
        description: {
          fr: "Bouteille d'eau minérale 75 cl.",
          en: "75 cl mineral water bottle.",
          de: "75 cl Mineralwasserflasche."
        },
        price: "22",
        image: "images/eau-75.jpg"
      },
      {
        name: { fr: "OULMES", en: "OULMES (Sparkling)", de: "OULMES (Sprudel)" },
        description: {
          fr: "Eau minérale gazeuse.",
          en: "Sparkling mineral water.",
          de: "Sprudelndes Mineralwasser."
        },
        price: "16",
        image: "images/eau-oulmes.jpg"
      },
      {
        name: { fr: "0.5 l", en: "0.5 l", de: "0.5 l" },
        description: {
          fr: "Bouteille d'eau minérale 50 cl.",
          en: "50 cl mineral water bottle.",
          de: "50 cl Mineralwasserflasche."
        },
        price: "12",
        image: "images/eau-50.jpg"
      }
    
    ]
  },

  // =========================
  // BOISSONS FRAÎCHES (JUS)
  // =========================
  {
    category: {
      fr: "BOISSONS FRAÎCHES (JUS)",
      en: "FRESH DRINKS (JUICES)",
      de: "FRISCHE GETRÄNKE (SÄFTE)"
    },
    id: "boissons",
    items: [
      {
        name: { fr: "ZA3ZA3", en: "ZA3ZA3", de: "ZA3ZA3" },
        description: {
          fr: "Cocktail marocain riche en fruits secs et lait.",
          en: "Rich Moroccan cocktail with dried fruits and milk.",
          de: "Reicher marokkanischer Cocktail mit Nussfrüchten und Milch."
        },
        price: "46",
        image: "images/jus-za3za3.jpg"
      },
      {
        name: { fr: "COCKTAIL ORANGE", en: "ORANGE COCKTAIL", de: "ORANGEN-COCKTAIL" },
        description: {
          fr: "Cocktail à base d'orange.",
          en: "Orange-based cocktail.",
          de: "Cocktail auf Orangenbasis."
        },
        price: "42",
        image: "images/jus-cocktailorange.jpg"
      },
      {
        name: { fr: "JUS DE FRUITS SECS AVOCAT", en: "AVOCADO DRIED FRUIT JUICE", de: "AVOCADO-NUSSFRÜCHTE SAFT" },
        description: {
          fr: "Mélange d'avocat et de fruits secs.",
          en: "Blend of avocado and dried fruits.",
          de: "Mischung aus Avocado und Nussfrüchten."
        },
        price: "38",
        image: "images/jus-avocatsec.jpg"
      },
      {
        name: { fr: "PANACHÉ AU LAIT", en: "MILK PANACHE", de: "MILCH PANACHE" },
        description: {
          fr: "Mélange de jus de fruits au lait.",
          en: "Mix of fruit juices with milk.",
          de: "Mischung aus Fruchtsäften mit Milch."
        },
        price: "38",
        image: "images/jus-panache.jpg"
      },
      {
        name: { fr: "JUS DE FRAMBOISE", en: "RASPBERRY JUICE", de: "HIMBEERSAFT" },
        description: {
          fr: "Jus de framboise frais.",
          en: "Fresh raspberry juice.",
          de: "Frischer Himbeersaft."
        },
        price: "35",
        image: "images/jus-framboise.jpg"
      },
      {
        name: { fr: "JUS D'AVOCAT", en: "AVOCADO JUICE", de: "AVOCADOSAFT" },
        description: {
          fr: "Jus d'avocat frais.",
          en: "Fresh avocado juice.",
          de: "Frischer Avocadosaft."
        },
        price: "32",
        image: "images/jus-avocat.jpg"
      },
      {
        name: { fr: "JUS D'ANANAS", en: "PINEAPPLE JUICE", de: "ANANASSAFT" },
        description: {
          fr: "Jus d'ananas frais.",
          en: "Fresh pineapple juice.",
          de: "Frischer Ananassaft."
        },
        price: "32",
        image: "images/jus-ananas.jpg"
      },
      {
        name: { fr: "JUS DE MANGUE", en: "MANGO JUICE", de: "MANGOSSAFT" },
        description: {
          fr: "Jus de mangue fraîche.",
          en: "Fresh mango juice.",
          de: "Frischer Mangosaft."
        },
        price: "30",
        image: "images/jus-mangue.jpg"
      },
      {
        name: { fr: "JUS DE PÊCHE", en: "PEACH JUICE", de: "PFIRSICHSAFT" },
        description: {
          fr: "Jus de pêche fraîche.",
          en: "Fresh peach juice.",
          de: "Frischer Pfirsichsaft."
        },
        price: "30",
        image: "images/jus-peche.jpg"
      },
      {
        name: { fr: "JUS DE FRAISE", en: "STRAWBERRY JUICE", de: "ERDBEERSAFT" },
        description: {
          fr: "Jus de fraise fraîche.",
          en: "Fresh strawberry juice.",
          de: "Frischer Erdbeersaft."
        },
        price: "30",
        image: "images/jus-fraise.jpg"
      },
      {
        name: { fr: "JUS DE POMME / BANANE", en: "APPLE / BANANA JUICE", de: "APFEL / BANANENSAFT" },
        description: {
          fr: "Jus de pomme ou de banane.",
          en: "Apple or banana juice.",
          de: "Apfel- oder Bananensaft."
        },
        price: "28",
        image: "images/jus-pomme-banane.jpg"
      },
      {
        name: { fr: "JUS DE CITRON", en: "LEMON JUICE", de: "ZITRONENSAFT" },
        description: {
          fr: "Jus de citron frais.",
          en: "Fresh lemon juice.",
          de: "Frischer Zitronensaft."
        },
        price: "25",
        image: "images/jus-citron.jpg"
      },
      {
        name: { fr: "JUS DE CAROTTE", en: "CARROT JUICE", de: "KAROTTENSAFT" },
        description: {
          fr: "Jus de carotte frais.",
          en: "Fresh carrot juice.",
          de: "Frischer Karottensaft."
        },
        price: "25",
        image: "images/jus-carotte.jpg"
      },
      {
        name: { fr: "JUS D'ORANGE", en: "ORANGE JUICE", de: "ORANGENSAFT" },
        description: {
          fr: "Jus d'orange frais pressé.",
          en: "Freshly squeezed orange juice.",
          de: "Frisch gepresster Orangensaft."
        },
        price: "22",
        image: "images/jus-orange.jpg"
      }
    ]
  },

  // =========================
  // ICE TEA
  // =========================
  {
    category: {
      fr: "ICE TEA",
      en: "ICE TEA",
      de: "EISTEE"
    },
    items: [
      {
        name: { fr: "ICE TEA CITRON", en: "LEMON ICE TEA", de: "ZITRONEN-EISTEE" },
        description: {
          fr: "Thé glacé saveur citron.",
          en: "Lemon flavored iced tea.",
          de: "Eistee mit Zitronengeschmack."
        },
        price: "28",
        image: "images/icetea-citron.jpg"
      },
      {
        name: { fr: "ICE TEA PÊCHE", en: "PEACH ICE TEA", de: "PFIRSICH-EISTEE" },
        description: {
          fr: "Thé glacé saveur pêche.",
          en: "Peach flavored iced tea.",
          de: "Eistee mit Pfirsichgeschmack."
        },
        price: "28",
        image: "images/icetea-peche.jpg"
      },
      {
        name: { fr: "ICE TEA FRAMBOISE", en: "RASPBERRY ICE TEA", de: "HIMBEER-EISTEE" },
        description: {
          fr: "Thé glacé saveur framboise.",
          en: "Raspberry flavored iced tea.",
          de: "Eistee mit Himbeergeschmack."
        },
        price: "28",
        image: "images/icetea-framboise.jpg"
      }
    ]
  },

  // =========================
  // ICE COFFEE
  // =========================
  {
    category: {
      fr: "ICE COFFEE",
      en: "ICE COFFEE",
      de: "EISKAFFEE"
    },
    items: [
      {
        name: { fr: "CAFÉ GLACÉ AROMATISÉ", en: "FLAVORED ICE COFFEE", de: "AROMATISIERTER EISKAFFEE" },
        description: {
          fr: "Café glacé avec un arôme au choix.",
          en: "Iced coffee with a flavor of choice.",
          de: "Eiskaffee mit Geschmack nach Wahl."
        },
        price: "23",
        image: "images/icecoffee-arom.jpg"
      },
      {
        name: { fr: "CAFÉ GLACÉ CLASSIQUE", en: "CLASSIC ICE COFFEE", de: "KLASSISCHER EISKAFFEE" },
        description: {
          fr: "Café glacé traditionnel.",
          en: "Traditional iced coffee.",
          de: "Traditioneller Eiskaffee."
        },
        price: "20",
        image: "images/icecoffee-class.jpg"
      }
    ]
  },

  // =========================
  // FRAPPUCCINO
  // =========================
  {
    category: {
      fr: "FRAPPUCCINO",
      en: "FRAPPUCCINO",
      de: "FRAPPUCCINO"
    },
    items: [
      {
        name: { fr: "FRAPPUCCINO AROMATISÉ", en: "FLAVORED FRAPPUCCINO", de: "AROMATISIERTER FRAPPUCCINO" },
        description: {
          fr: "Frappuccino avec un arôme au choix.",
          en: "Frappuccino with a flavor of choice.",
          de: "Frappuccino mit Geschmack nach Wahl."
        },
        price: "28",
        image: "images/frappu-arom.jpg"
      },
      {
        name: { fr: "FRAPPUCCINO CLASSIQUE", en: "CLASSIC FRAPPUCCINO", de: "KLASSISCHER FRAPPUCCINO" },
        description: {
          fr: "Boisson glacée à base de café, style frappé.",
          en: "Blended iced coffee drink, frappé style.",
          de: "Gemischtes Eiskaffeegetränk, Frappé-Stil."
        },
        price: "25",
        image: "images/frappu-class.jpg"
      }
    ]
  },

  // =========================
  // COCKTAILS
  // =========================
  {
    category: {
      fr: "COCKTAILS",
      en: "COCKTAILS",
      de: "COCKTAILS"
    },
    items: [
      {
        name: { fr: "COCKTAIL GREY CORNER", en: "GREY CORNER COCKTAIL", de: "GREY CORNER COCKTAIL" },
        description: {
          fr: "Ananas, avocat, fruit de saison, sirop fruits de passion.",
          en: "Pineapple, avocado, seasonal fruit, passion fruit syrup.",
          de: "Ananas, Avocado, saisonale Frucht, Passionsfruchtsirup."
        },
        price: "48",
        image: "images/cocktail-gc.jpg"
      },
      {
        name: { fr: "FRAÎCHEUR", en: "FRESHNESS", de: "FRISCHE" },
        description: {
          fr: "Ananas, poire, citron, menthe.",
          en: "Pineapple, pear, lemon, mint.",
          de: "Ananas, Birne, Zitrone, Minze."
        },
        price: "42",
        image: "images/cocktail-fraicheur.jpg"
      },
      {
        name: { fr: "TROPICAL", en: "TROPICAL", de: "TROPISCH" },
        description: {
          fr: "Mangue, banane, orange, bissap.",
          en: "Mango, banana, orange, hibiscus.",
          de: "Mango, Banane, Orange, Hibiskus."
        },
        price: "42",
        image: "images/cocktail-tropical.jpg"
      },
      {
        name: { fr: "PINA COLADA", en: "PINA COLADA", de: "PINA COLADA" },
        description: {
          fr: "Ananas, noix de coco.",
          en: "Pineapple, coconut.",
          de: "Ananas, Kokosnuss."
        },
        price: "42",
        image: "images/cocktail-pinacolada.jpg"
      },
      {
        name: { fr: "COCKTAIL GINGEMBRE", en: "GINGER COCKTAIL", de: "INGWER-COCKTAIL" },
        description: {
          fr: "Gingembre, citron, miel.",
          en: "Ginger, lemon, honey.",
          de: "Ingwer, Zitrone, Honig."
        },
        price: "32",
        image: "images/cocktail-gingembre.jpg"
      },
      {
        name: { fr: "SAN FRANCISCO", en: "SAN FRANCISCO", de: "SAN FRANCISCO" },
        description: {
          fr: "Gingembre, bissap, orange, citron.",
          en: "Ginger, hibiscus, orange, lemon.",
          de: "Ingwer, Hibiskus, Orange, Zitrone."
        },
        price: "34",
        image: "images/cocktail-sf.jpg"
      }
    ]
  },

  // =========================
  // MOJITO
  // =========================
  {
    category: {
      fr: "MOJITO",
      en: "MOJITO",
      de: "MOJITO"
    },
    items: [
      {
        name: { fr: "MOJITO REDBULL", en: "REDBULL MOJITO", de: "REDBULL MOJITO" },
        description: {
          fr: "Mojito énergisant au Redbull.",
          en: "Energizing mojito with Redbull.",
          de: "Belebender Mojito mit Redbull."
        },
        price: "44",
        image: "images/mojito-redbull.jpg"
      },
      {
        name: { fr: "MOJITO TROPICAL", en: "TROPICAL MOJITO", de: "TROPISCHER MOJITO" },
        description: {
          fr: "Mojito aux saveurs tropicales.",
          en: "Mojito with tropical flavors.",
          de: "Mojito mit tropischen Aromen."
        },
        price: "38",
        image: "images/mojito-tropical.jpg"
      },
      {
        name: { fr: "MOJITO CITRON", en: "LEMON MOJITO", de: "ZITRONEN MOJITO" },
        description: {
          fr: "Mojito classique au citron.",
          en: "Classic lemon mojito.",
          de: "Klassischer Zitronen Mojito."
        },
        price: "34",
        image: "images/mojito-citron.jpg"
      }
    ]
  },

  // =========================
  // SMOOTHIES
  // =========================
  {
    category: {
      fr: "SMOOTHIES",
      en: "SMOOTHIES",
      de: "SMOOTHIES"
    },
    items: [
      {
        name: { fr: "JELLY ALMOND", en: "JELLY ALMOND", de: "JELLY ALMOND" },
        description: {
          fr: "Banane, amlou, framboise, myrtille.",
          en: "Banana, amlou, raspberry, blueberry.",
          de: "Banane, Amlou, Himbeere, Blaubeere."
        },
        price: "48",
        image: "images/smoothie-jelly.jpg"
      },
      {
        name: { fr: "PINK SMOOTHIE", en: "PINK SMOOTHIE", de: "PINK SMOOTHIE" },
        description: {
          fr: "Framboise, orange, fraise.",
          en: "Raspberry, orange, strawberry.",
          de: "Himbeere, Orange, Erdbeere."
        },
        price: "48",
        image: "images/smoothie-pink.jpg"
      },
      {
        name: { fr: "TRIPLE BERRY", en: "TRIPLE BERRY", de: "TRIPLE BERRY" },
        description: {
          fr: "Myrtille, framboise, fraise.",
          en: "Blueberry, raspberry, strawberry.",
          de: "Blaubeere, Himbeere, Erdbeere."
        },
        price: "48",
        image: "images/smoothie-triple.jpg"
      },
      {
        name: { fr: "ÉNERGÉTIQUE", en: "ENERGETIC", de: "ENERGETISCH" },
        description: {
          fr: "Banane, ananas, mangue.",
          en: "Banana, pineapple, mango.",
          de: "Banane, Ananas, Mango."
        },
        price: "42",
        image: "images/smoothie-energetic.jpg"
      },
    
      {
        name: { fr: "MULTI-VITAMINE", en: "MULTI-VITAMIN", de: "MULTI-VITAMIN" },
        description: {
          fr: "Orange, pêche, carotte.",
          en: "Orange, peach, carrot.",
          de: "Orange, Pfirsich, Karotte."
        },
        price: "42",
        image: "images/smoothie-multiv.jpg"
      },
      {
        name: { fr: "HAWAIEN", en: "HAWAIIAN", de: "HAWAIIAN" },
        description: {
          fr: "Fraise, ananas, kiwi, avocat, menthe.",
          en: "Strawberry, pineapple, kiwi, avocado, mint.",
          de: "Erdbeere, Ananas, Kiwi, Avocado, Minze."
        },
        price: "42",
        image: "images/smoothie-hawai.jpg"
      }
    ]
  },

  // =========================
  // SMOOTHIE – BOWL
  // =========================
  {
    category: {
      fr: "SMOOTHIE – BOWL",
      en: "SMOOTHIE BOWL",
      de: "SMOOTHIE BOWL"
    },
    items: [
      {
        name: { fr: "ULTRA – VITAMINES", en: "ULTRA – VITAMINS", de: "ULTRA – VITAMINE" },
        description: {
          fr: "Mangue, avocat, banane, citron, fraise, orange.",
          en: "Mango, avocado, banana, lemon, strawberry, orange.",
          de: "Mango, Avocado, Banane, Zitrone, Erdbeere, Orange."
        },
        price: "48",
        image: "images/smoothiebowl-ultra.jpg"
      },
      {
        name: { fr: "EXOTIQUE", en: "EXOTIC", de: "EXOTISCH" },
        description: {
          fr: "Ananas, pêche, mangue, banane, orange.",
          en: "Pineapple, peach, mango, banana, orange.",
          de: "Ananas, Pfirsich, Mango, Banane, Orange."
        },
        price: "48",
        image: "images/smoothiebowl-exotic.jpg"
      }
    ]
  },

  // =========================
  // MILKSHAKES
  // =========================
  {
    category: {
      fr: "MILKSHAKES",
      en: "MILKSHAKES",
      de: "MILKSHAKES"
    },
    items: [
      {
        name: { fr: "MILKSHAKE FRAISE", en: "STRAWBERRY MILKSHAKE", de: "ERDBEER MILKSHAKE" },
        description: {
          fr: "Milkshake à la fraise.",
          en: "Strawberry flavored milkshake.",
          de: "Milkshake mit Erdbeergeschmack."
        },
        price: "42",
        image: "images/milkshake-fraise.jpg"
      },
      {
        name: { fr: "MILKSHAKE CARAMEL", en: "CARAMEL MILKSHAKE", de: "KARAMELL MILKSHAKE" },
        description: {
          fr: "Milkshake au caramel.",
          en: "Caramel flavored milkshake.",
          de: "Milkshake mit Karamellgeschmack."
        },
        price: "42",
        image: "images/milkshake-caramel.jpg"
      },
      {
        name: { fr: "MILKSHAKE CHOCOLAT", en: "CHOCOLATE MILKSHAKE", de: "SCHOKOLADEN MILKSHAKE" },
        description: {
          fr: "Milkshake au chocolat.",
          en: "Chocolate flavored milkshake.",
          de: "Milkshake mit Schokoladengeschmack."
        },
        price: "42",
        image: "images/milkshake-choc.jpg"
      },
      {
        name: { fr: "MILKSHAKE VANILLE", en: "VANILLA MILKSHAKE", de: "VANILLE MILKSHAKE" },
        description: {
          fr: "Milkshake à la vanille.",
          en: "Vanilla flavored milkshake.",
          de: "Milkshake mit Vanillegeschmack."
        },
        price: "42",
        image: "images/milkshake-vanille.jpg"
      },
      {
        name: { fr: "MILKSHAKE COOKIES", en: "COOKIES MILKSHAKE", de: "COOKIES MILKSHAKE" },
        description: {
          fr: "Milkshake aux cookies.",
          en: "Cookies flavored milkshake.",
          de: "Milkshake mit Cookies-Geschmack."
        },
        price: "42",
        image: "images/milkshake-cookies.jpg"
      },
      {
        name: { fr: "MILKSHAKE KITKAT", en: "KITKAT MILKSHAKE", de: "KITKAT MILKSHAKE" },
        description: {
          fr: "Milkshake au Kitkat.",
          en: "Kitkat flavored milkshake.",
          de: "Milkshake mit Kitkat-Geschmack."
        },
        price: "42",
        image: "images/milkshake-kitkat.jpg"
      },
      {
        name: { fr: "MILKSHAKE OREO", en: "OREO MILKSHAKE", de: "OREO MILKSHAKE" },
        description: {
          fr: "Milkshake aux Oreo.",
          en: "Oreo flavored milkshake.",
          de: "Milkshake mit Oreo-Geschmack."
        },
        price: "42",
        image: "images/milkshake-oreo.jpg"
      },
      {
        name: { fr: "MILKSHAKE NUTELLA", en: "NUTELLA MILKSHAKE", de: "NUTELLA MILKSHAKE" },
        description: {
          fr: "Milkshake au Nutella.",
          en: "Nutella flavored milkshake.",
          de: "Milkshake mit Nutella-Geschmack."
        },
        price: "42",
        image: "images/milkshake-nutella.jpg"
      },
     
      {
        name: { fr: "SUPPLÉMENT CHANTILLY", en: "WHIPPED CREAM SUPPLEMENT", de: "SCHLAGSAHNE ZUSCHLAG" },
        description: {
          fr: "Ajout de crème chantilly.",
          en: "Addition of whipped cream.",
          de: "Zusatz von Schlagsahne."
        },
        price: "05",
        image: "images/milkshake-chant.jpg"
      }
    ]
  },

  // =========================
  // ORANGESHAKE
  // =========================
  {
    category: {
      fr: "ORANGESHAKE",
      en: "ORANGESHAKE",
      de: "ORANGESHAKE"
    },
    items: [
      {
        name: { fr: "ORANGESHAKE", en: "ORANGESHAKE", de: "ORANGESHAKE" },
        description: {
          fr: "Milkshake à l'orange (Fraise, caramel, chocolat, vanille, oreo, nougat).",
          en: "Orange Milkshake (Strawberry, caramel, chocolate, vanilla, oreo, nougat).",
          de: "Orangen Milkshake (Erdbeere, Karamell, Schokolade, Vanille, Oreo, Nougat)."
        },
        price: "42",
        image: "images/orangshake.jpg"
      }
    ]
  },

  // =========================
  // COUPE DE GLACE
  // =========================
  {
    category: {
      fr: "COUPE DE GLACE",
      en: "ICE CREAM CUPS",
      de: "EISBECHER"
    },
    id: "glace",
    items: [
      {
        name: { fr: "COUPE GREY CORNER", en: "GREY CORNER CUP", de: "GREY CORNER BECHER" },
        description: {
          fr: "Vanille, nougat, yaourt,pistache.",
          en: "Vanilla, nougat, yogurt,pistachio.",
          de: "Vanille, Nougat, Waldbeerjoghurt,pistazie."
        },
        price: "65",
        image: "images/glace-gc.jpg"
      },
      {
        name: { fr: "BANANA SPLIT", en: "BANANA SPLIT", de: "BANANA SPLIT" },
        description: {
          fr: "Vanille, chocolat, fraise.",
          en: "Vanilla, chocolate, strawberry.",
          de: "Vanille, Schokolade, Erdbeere."
        },
        price: "50",
        image: "images/glace-banana.jpg"
      },
      {
        name: { fr: "COUPE AMOR", en: "AMOR CUP", de: "AMOR BECHER" },
        description: {
          fr: "Fraise, yaourt,nougat.",
          en: "Strawberry, yogurt, nougat.",
          de: "Erdbeere, Joghurt, nougat."
        },
        price: "45",
        image: "images/glace-amor.jpg"
      },
      {
        name: { fr: "COUPE ENFANT", en: "KIDS CUP", de: "KINDERBECHER" },
        description: {
          fr: "chocolat, bubble, Chantilly.",
          en: "chocolate, bubble, whipped cream.",
          de: "schokolade, Bubble, Schlagsahne."
        },
        price: "40",
        image: "images/glace-enfant.jpg"
      },
      {
        name: { fr: "2 Boules de glace", en: "2 Scoops of Ice Cream", de: "2 Kugeln Eis" },
        description: {
          fr: "Parfums au choix : Vanille, chocolat, nougat, pistache, bubble, yaourt fruit des bois, fraise, caramel.",
          en: "Flavors of choice: Vanilla, chocolate, nougat, pitachio, bubble, forest fruit yogurt, strawberry, caramel.",
          de: "Geschmacksrichtungen nach Wahl: Vanille, Schokolade, Nougat, pistazie, Bubble, Waldbeerjoghurt, Erdbeere, Karamell."
        },
        price: "30",
        image: "images/glace-2boules.jpg"
      },
      {
        name: { fr: "1 Boule de glace", en: "1 Scoop of Ice Cream", de: "1 Kugel Eis" },
        description: {
          fr: "Parfum au choix : Vanille, chocolat, nougat, pitache, bubble, yaourt fruit des bois, fraise, caramel.",
          en: "Flavor of choice: Vanilla, chocolate, nougat, pistachio, bubble, forest fruit yogurt, strawberry, caramel.",
          de: "Geschmack nach Wahl: Vanille, Schokolade, Nougat, pistazie, Bubble, Waldbeerjoghurt, Erdbeere, Karamell."
        },
        price: "16",
        image: "images/glace-1boule.jpg"
      }
    ]
  }
];
// ==========================================
// ============= GLOBAL SETTINGS ============
// ==========================================

// DOM
const menuGrid    = document.getElementById("menu-grid");
const langButtons = document.querySelectorAll(".lang-button");
const burger      = document.getElementById("burger");
const burgerNav   = document.getElementById("burgerNav");
const burgerOverlay = document.getElementById("burgerOverlay");
const backToTop   = document.getElementById("backToTop");

// NEW LIGHTBOX PROTÉGÉE
const secureLightbox = document.getElementById("secureLightbox");
const secureLightboxContent = document.querySelector(".secure-lightbox-content");

// Langue actuelle
let currentLang = localStorage.getItem("lang") || "fr";

// Flag pour éviter d'attacher plusieurs fois les listeners de protection
let imagesProtected = false;

// ==========================================
// =========== RENDER MENU DYNAMIC ==========
// ==========================================

function renderMenu() {
    if (!menuData || !Array.isArray(menuData) || !menuGrid) {
        console.error("❌ ERREUR : menuData ou menuGrid manquant.");
        return;
    }

    menuGrid.innerHTML = "";

    menuData.forEach(category => {
        const section = document.createElement("section");
        section.className = "menu-section";
        if (category.id) section.id = category.id;

        section.innerHTML = `
            <h2 class="section-title">${category.category[currentLang]}</h2>
            <div class="items"></div>
        `;

        const itemsContainer = section.querySelector(".items");

        category.items.forEach(item => {
            // CORRECTION : On ne déclare 'card' qu'une seule fois
            const card = document.createElement("article");
            card.className = "menu-item";

            // Gestion du badge avec traduction (ROUGE ASSORTI)
            if (item.isNew === true) {
                card.classList.add("nouveau-flash");
                
                let badgeText = "NOUVEAU"; 
                if (currentLang === "en") badgeText = "NEW";
                if (currentLang === "de") badgeText = "NEU";
                
                card.setAttribute("data-badge", badgeText);
            }

            // Configuration de la lightbox
            card.dataset.img = item.image;
            card.dataset.alt = item.name[currentLang];

            // Remplissage de la carte
            card.innerHTML = `
                <div class="item-img-wrapper" 
                    style="background-image: url('${item.image}')">
                </div>

                <div class="item-info">
                    <div class="item-price-line">
                        <h3 class="item-name">${item.name[currentLang]}</h3>
                        <span class="item-price">${item.price}</span>
                    </div>
                    <p class="item-desc">${item.description[currentLang]}</p>
                </div>
            `;

            itemsContainer.appendChild(card);
        });

        menuGrid.appendChild(section);
    });

    enableSecureLightbox();
    protectImages();
}// ... (Le reste de votre script.js ne change pas) ...

// ==========================================
// ======= LIGHTBOX PROTÉGÉE (SECURE) =======
// ==========================================

function enableSecureLightbox() {
    if (!secureLightbox || !secureLightboxContent) return;

    // (Re-)attache aux .menu-item actuels
    document.querySelectorAll(".menu-item").forEach(card => {
        // nécessité de retirer d'abord d'anciens listeners si re-render fréquent ?
        card.addEventListener("click", () => {
            const url = card.dataset.img;
            if (!url) return;

            // Zoom totalement protégé
            secureLightboxContent.style.backgroundImage = `url("${url}")`;
            secureLightbox.classList.add("active");
        });
    });

    // fermer en cliquant autour
    secureLightbox.addEventListener("click", (e) => {
        if (e.target === secureLightbox) {
            secureLightbox.classList.remove("active");
        }
    });
}



// ==========================================
// ======= PROTECTION DES IMAGES ============
// ==========================================

function protectImages() {
    if (imagesProtected) return; // déjà protégé -> ne rien faire

    // empêche le clic droit
    document.addEventListener("contextmenu", e => e.preventDefault());

    // empêche sélection
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";

    // empêche appui long safari
    document.body.style.webkitTouchCallout = "none";

    // empêche raccourcis
    document.addEventListener("keydown", e => {
        const key = (e.key || "").toLowerCase();
        if (
            (e.ctrlKey && key === "s") ||
            (e.ctrlKey && key === "u") ||
            (e.ctrlKey && e.shiftKey && key === "i")
        ) {
            e.preventDefault();
        }
    });

    imagesProtected = true;
}



// ==========================================
// ============== LANG SWITCH ===============
// ==========================================

function applyLanguageToStaticTexts() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const fr = el.getAttribute("data-fr");
        const en = el.getAttribute("data-en");
        const de = el.getAttribute("data-de");

        const value = (currentLang === "fr")
            ? fr
            : (currentLang === "en" ? en : de);

        if (value) el.textContent = value;
    });
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("lang", lang);

    applyLanguageToStaticTexts();
    renderMenu();
}

langButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        langButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        setLanguage(btn.dataset.lang);
    });
});

langButtons.forEach(btn => {
    if (btn.dataset.lang === currentLang) {
        btn.classList.add("active");
    }
});

// ===== POPUP ÉVÉNEMENT =====
const eventBtn = document.getElementById("eventBtn");
const eventPopup = document.getElementById("eventPopup");
const closePopup = document.getElementById("closePopup");

if (eventBtn && eventPopup && closePopup) {

    // Ouvrir
    eventBtn.addEventListener("click", () => {
        eventPopup.style.display = "flex";
    });

    // Fermer
    closePopup.addEventListener("click", () => {
        eventPopup.style.display = "none";
    });

    // Fermer en cliquant en dehors
    eventPopup.addEventListener("click", (e) => {
        if (e.target === eventPopup) {
            eventPopup.style.display = "none";
        }
    });
}

// ==========================================
// ============== BURGER MENU ===============
// ==========================================

function closeBurgerMenu() {
    burger.classList.remove("active");
    burgerNav.classList.remove("active");
    burgerOverlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
}

if (burger && burgerNav && burgerOverlay) {
    burger.addEventListener("click", () => {
        burger.classList.toggle("active");
        burgerNav.classList.toggle("active");
        burgerOverlay.classList.toggle("active");
        document.body.classList.toggle("no-scroll");
    });

    burgerOverlay.addEventListener("click", closeBurgerMenu);

    burgerNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeBurgerMenu);
    });
}


// ==========================================
// ========= BOUTON REMONTER EN HAUT ========
// ==========================================

if (backToTop) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}



// ==========================================
// ============ BARRE DE RECHERCHE ==========
// ==========================================

// Filtre les éléments du menu selon la saisie
function applySearchFilter() {
    const input = document.getElementById("searchInput");
    if (!input) return;

    const term = (input.value || "").toLowerCase().trim();
    const cards = document.querySelectorAll(".menu-item");

    cards.forEach(card => {
        const titleEl = card.querySelector(".item-name");
        const descEl  = card.querySelector(".item-desc");

        const title = titleEl ? titleEl.textContent.toLowerCase() : "";
        const desc  = descEl  ? descEl.textContent.toLowerCase()  : "";

        const matches = !term || title.includes(term) || desc.includes(term);

        card.style.display = matches ? "" : "none";
    });
}

// Active les événements de la barre de recherche
function activateSearch() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
        applySearchFilter();
    });

    // applique le filtre s’il y a déjà du texte
    applySearchFilter();
}
// ==========================================
// ============== BANDE D'ÉVÉNEMENT (LIGHTBOX) ==
// ==========================================

function activateEventBanner() {
    const eventBanner = document.getElementById("eventBanner");
    
    // Si la bannière n'est pas trouvée, on sort
    if (!eventBanner) {
        console.warn("La bande d'événement (eventBanner) est manquante dans le HTML.");
        return;
    }
    
    const eventImageSrc = eventBanner.dataset.eventImg;

    if (eventImageSrc) {
        eventBanner.addEventListener("click", () => {
            // Récupère les éléments de la LightBox Sécurisée (déjà existante dans votre index.html)
            const secureLightbox = document.getElementById("secureLightbox");
            const secureLightboxContent = document.querySelector(".secure-lightbox-content");
            const secureLightboxCaption = document.getElementById("secureLightboxCaption");

            if (secureLightbox && secureLightboxContent) {
                secureLightboxContent.style.backgroundImage = `url('${eventImageSrc}')`;
                secureLightboxContent.dataset.originalSrc = eventImageSrc; // Pour la protection
                
                // Récupère le texte de la bannière pour l'utiliser comme légende
                const bannerText = eventBanner.querySelector(".event-text") ? eventBanner.querySelector(".event-text").textContent : "Événement Spécial";
                secureLightboxCaption.textContent = bannerText; 

                // Ouvre la LightBox
                secureLightbox.classList.add("active");
                document.body.classList.add("no-scroll");
            } else {
                 console.error("Les éléments Lightbox (secureLightbox, secureLightboxContent) sont manquants. Assurez-vous que la LightBox existe dans index.html.");
            }
        });
    }
}


// ==========================================
// ================ INITIAL LOAD ============
// ==========================================

applyLanguageToStaticTexts();
renderMenu();          // Crée toutes les .menu-item
setTimeout(activateSearch, 50); // Déclenchement de la recherche
activateEventBanner(); // 💥 NOUVEL APPEL : Active le clic sur la bannière
