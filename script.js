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
        image: "images/entree-tartare.png",
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
        image: "images/Couscous-poulet.jpg"
      },
      {
        name: { fr: "Couscous poulet avec petit lait", en: "Chicken couscous with buttermilk", de: "Hähnchen-Couscous mit Buttermilch" },
        description: {
          fr: "Plat traditionnel servi le vendredi.",
          en: "Traditional dish served on Fridays.",
          de: "Traditionelles Gericht, das freitags serviert wird."
        },
        price: "54",
        image: "images/Couscous-poulet.jpg"
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
        image: "images/Wrap-poulet.jpg",
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
        image: "images/Wrap-viande-hachee.jpg",
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
        image: "images/Wrap-gourmand.jpg",
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

'use strict';

// DOM
const menuGrid = document.getElementById("menu-grid");
const langButtons = document.querySelectorAll(".lang-button");
const burger = document.getElementById("burger");
const burgerNav = document.getElementById("burgerNav");
const burgerOverlay = document.getElementById("burgerOverlay");
const backToTop = document.getElementById("backToTop");
const floatingCloseCategory = document.getElementById("floatingCloseCategory");

// LIGHTBOX PROTÉGÉE
const secureLightbox = document.getElementById("secureLightbox");
const secureLightboxContent = document.querySelector(".secure-lightbox-content");

// Langue actuelle
let currentLang = localStorage.getItem("lang") || "fr";

// System Freeze state
let systemFrozen = false;

// Flag pour éviter d'attacher plusieurs fois les listeners de protection
let imagesProtected = false;

// ==========================================
// ========= TEXTE PRIX EN DIRHAMS ==========
// ==========================================

const PRIX_TEXTS = {
  fr: "★ Tous les prix sont en dirhams marocains (MAD)",
  en: "★ All prices are in Moroccan Dirhams (MAD)",
  de: "★ Alle Preise sind in Marokkanischen Dirham (MAD)"
};

function updatePrixInfo() {
  const el = document.getElementById("prixInfo");
  if (el) el.textContent = PRIX_TEXTS[currentLang] || PRIX_TEXTS.fr;
}

// ==========================================
// =========== RENDER MENU DYNAMIC ==========
// ==========================================

function renderMenu() {
  if (!menuData || !Array.isArray(menuData) || !menuGrid) {
    console.error("❌ ERREUR : menuData ou menuGrid manquant.");
    return;
  }

  menuGrid.innerHTML = "";

  menuData.forEach((category, catIndex) => {
    // Generate clean ID if missing
    const categoryId = category.id || category.category.fr.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    
    // Choose banner image: use first item's image, or a fallback if none
    const bannerImg = (category.items && category.items.length > 0) 
        ? category.items[0].image 
        : "images/logo-gold.png";

    const drawer = document.createElement("div");
    drawer.className = "category-drawer";
    drawer.id = categoryId;

    drawer.innerHTML = `
      <div class="category-drawer-header">
        <div class="category-drawer-header-bg" style="background-image: url('${bannerImg}')"></div>
        <div class="category-drawer-header-overlay"></div>
        <div class="category-drawer-header-content">
          <h2 class="category-drawer-title">${category.category[currentLang]}</h2>
          <span class="category-drawer-chevron">
            <svg viewBox="0 0 24 24">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
          </span>
        </div>
      </div>
      <div class="category-drawer-body">
        <div class="category-drawer-grid items"></div>
      </div>
    `;

    // Bind toggle click
    const header = drawer.querySelector(".category-drawer-header");
    header.addEventListener("click", () => {
      toggleCategoryDrawer(drawer);
    });

    const itemsContainer = drawer.querySelector(".items");

    category.items.forEach((item, itemIndex) => {
      item.categoryId = categoryId;
      const card = document.createElement("article");
      card.className = "menu-item";
      card.id = `item-${categoryId}-${itemIndex}`;
      card.style.setProperty("--item-index", itemIndex);

      // Badge NEW / NOUVEAU / NEU
      if (item.isNew === true) {
        card.classList.add("nouveau-flash");
        const badgeText = currentLang === "en" ? "NEW"
          : currentLang === "de" ? "NEU"
            : "NOUVEAU";
        card.setAttribute("data-badge", badgeText);
      }

      // Configuration lightbox
      card.dataset.img = item.image;
      card.dataset.alt = item.name[currentLang];

      const btnText = currentLang === "en" ? "+ Add"
        : currentLang === "de" ? "+ Hinzufügen"
          : "+ Ajouter";

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
                    <button class="add-to-cart-btn" aria-label="Ajouter au panier">${btnText}</button>
                </div>
            `;

      // Bind Stop-Propagated Plus Button
      const addBtn = card.querySelector(".add-to-cart-btn");
      if (addBtn) {
        addBtn.addEventListener("click", (e) => {
          e.stopPropagation(); // Prevents secure lightbox from launching!
          addToCart(item);
        });
      }

      itemsContainer.appendChild(card);
    });

    menuGrid.appendChild(drawer);

  });

  enableSecureLightbox();
  protectImages();
  renderNewItemsCarousel();
}

// ==========================================
// =========== RENDER NEW ITEMS CAROUSEL =====
// ==========================================

function renderNewItemsCarousel() {
  const carousel = document.getElementById("newItemsCarousel");
  if (!carousel) return;

  carousel.innerHTML = "";

  // Find all items with isNew === true in menuData
  const newItems = [];
  menuData.forEach((category) => {
    const categoryId = category.id || category.category.fr.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    category.items.forEach((item, itemIndex) => {
      if (item.isNew === true) {
        newItems.push({
          ...item,
          categoryId,
          itemIndex,
          itemId: `item-${categoryId}-${itemIndex}`
        });
      }
    });
  });

  if (newItems.length === 0) {
    carousel.style.display = "none";
    return;
  }

  carousel.style.display = "flex";

  newItems.forEach((item) => {
    const itemEl = document.createElement("div");
    itemEl.className = "carousel-item";

    const badgeText = currentLang === "en" ? "NEW"
      : currentLang === "de" ? "NEU"
        : "NOUVEAU";

    itemEl.innerHTML = `
      <div class="carousel-img-wrapper">
        <span class="carousel-badge">${badgeText}</span>
        <img class="carousel-img" src="${item.image}" alt="${item.name[currentLang]}" loading="lazy">
      </div>
      <span class="carousel-title">${item.name[currentLang]}</span>
    `;

    // Click handler to open drawer and scroll smoothly
    itemEl.addEventListener("click", () => {
      const targetDrawer = document.getElementById(item.categoryId);
      if (targetDrawer) {
        // If the drawer is not open, open it
        if (!targetDrawer.classList.contains("open")) {
          // Accordion: close other drawers
          document.querySelectorAll(".category-drawer.open").forEach(other => {
            if (other !== targetDrawer) {
              closeDrawer(other);
            }
          });
          openDrawer(targetDrawer);
        }

        // Scroll smoothly to the item card
        const targetCard = document.getElementById(item.itemId);
        if (targetCard) {
          setTimeout(() => {
            targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
            // Add a temporary subtle flash highlight effect to draw focus
            targetCard.classList.add("highlight-flash");
            setTimeout(() => {
              targetCard.classList.remove("highlight-flash");
            }, 1500);
          }, 200);
        }
      }
    });

    carousel.appendChild(itemEl);
  });
}

// ==========================================
// ============ DRAWER HELPER FUNCTIONS =====
// ==========================================

// Helper function to update floating buttons visibility instantly
function updateFloatingButtons() {
  const openDrawerElement = document.querySelector(".category-drawer.open");
  const floatingCloseCategory = document.getElementById("floatingCloseCategory");
  const backToTop = document.getElementById("backToTop");

  if (openDrawerElement) {
    if (floatingCloseCategory) floatingCloseCategory.classList.add("show");
    if (backToTop) backToTop.classList.remove("show");
  } else {
    if (floatingCloseCategory) floatingCloseCategory.classList.remove("show");
    if (backToTop) {
      backToTop.classList.toggle("show", window.scrollY > 400);
    }
  }
}

function toggleCategoryDrawer(drawerIdOrElement) {
  const drawer = typeof drawerIdOrElement === "string"
    ? document.getElementById(drawerIdOrElement)
    : drawerIdOrElement;
  if (!drawer) return;

  const isOpen = drawer.classList.contains("open");

  if (!isOpen) {
    // Accordion: close other drawers
    document.querySelectorAll(".category-drawer.open").forEach(other => {
      if (other !== drawer) {
        closeDrawer(other);
      }
    });
    openDrawer(drawer, true);
  } else {
    closeDrawer(drawer);
  }
}

function openDrawer(drawer, scrollToFirst = false) {
  const body = drawer.querySelector(".category-drawer-body");
  if (!body) return;

  drawer.classList.add("open");
  body.style.maxHeight = body.scrollHeight + "px";

  const onTransitionEnd = () => {
    if (drawer.classList.contains("open")) {
      body.style.maxHeight = "none";
    }
    body.removeEventListener("transitionend", onTransitionEnd);
  };
  body.addEventListener("transitionend", onTransitionEnd);

  // Update button visibility immediately when drawer is opened
  updateFloatingButtons();

  if (scrollToFirst) {
    const firstItem = drawer.querySelector(".menu-item");
    if (firstItem) {
      setTimeout(() => {
        firstItem.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    } else {
      setTimeout(() => {
        drawer.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  }
}

function closeDrawer(drawer) {
  const body = drawer.querySelector(".category-drawer-body");
  if (!body) return;

  body.style.maxHeight = body.scrollHeight + "px";
  body.offsetHeight; // force reflow

  drawer.classList.remove("open");
  body.style.maxHeight = "0";

  // Update button visibility immediately when drawer is closed
  updateFloatingButtons();
}

function handleHashNavigation() {
  const hash = window.location.hash;
  if (!hash) return;

  const targetId = hash.substring(1);
  const targetDrawer = document.getElementById(targetId);
  if (targetDrawer && targetDrawer.classList.contains("category-drawer")) {
    // If the drawer is already open, we don't need to re-trigger opening or scrolling
    if (targetDrawer.classList.contains("open")) return;

    // Accordion: close other drawers
    document.querySelectorAll(".category-drawer.open").forEach(other => {
      if (other !== targetDrawer) {
        closeDrawer(other);
      }
    });

    openDrawer(targetDrawer, true);
  }
}

function setupNavigationListeners() {
  window.addEventListener("hashchange", handleHashNavigation);

  // Handle click on category nav links (both horizontal and burger)
  const navLinks = document.querySelectorAll(".categories-horizontal a, #burgerNav a");
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        const targetId = href.substring(1);
        const targetDrawer = document.getElementById(targetId);
        if (targetDrawer && targetDrawer.classList.contains("category-drawer")) {
          e.preventDefault(); // prevent default browser jump
          
          // Accordion: close other drawers
          document.querySelectorAll(".category-drawer.open").forEach(other => {
            if (other !== targetDrawer) {
              closeDrawer(other);
            }
          });
          
          openDrawer(targetDrawer, true);
          
          // Update the hash in URL
          if (window.location.hash !== href) {
            window.location.hash = href;
          }
        }
      }
    });
  });
}

// ==========================================
// ======= LIGHTBOX PROTÉGÉE (SECURE) =======
// ==========================================

function enableSecureLightbox() {
  if (!secureLightbox || !secureLightboxContent) return;

  document.querySelectorAll(".menu-item").forEach(card => {
    card.addEventListener("click", () => {
      const url = card.dataset.img;
      if (!url) return;
      secureLightboxContent.style.backgroundImage = `url("${url}")`;
      secureLightbox.classList.add("active");
      document.body.classList.add("no-scroll");
      document.documentElement.classList.add("no-scroll");
    });
  });

  // Fermer au clic sur le fond
  secureLightbox.addEventListener("click", e => {
    if (e.target === secureLightbox) closeLightbox();
  });

  // Bouton fermer
  const closeBtn = secureLightboxContent.querySelector(".close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeLightbox);
  }

  // Fermer avec Escape
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && secureLightbox.classList.contains("active")) {
      closeLightbox();
    }
  });
}

function closeLightbox() {
  if (!secureLightbox) return;
  secureLightbox.classList.remove("active");
  if (secureLightboxContent) secureLightboxContent.style.backgroundImage = "";
  document.body.classList.remove("no-scroll");
  document.documentElement.classList.remove("no-scroll");
}

// ==========================================
// ======= PROTECTION DES IMAGES ============
// ==========================================

function protectImages() {
  if (imagesProtected) return;

  document.addEventListener("contextmenu", e => e.preventDefault());

  document.body.style.userSelect = "none";
  document.body.style.webkitUserSelect = "none";
  document.body.style.webkitTouchCallout = "none";

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
    const value = el.getAttribute(`data-${currentLang}`)
      || el.getAttribute("data-fr");
    if (value !== null) el.textContent = value;
  });
}

function setLanguage(lang) {
  if (!["fr", "en", "de"].includes(lang)) lang = "fr";
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;

  // Mettre à jour les boutons actifs
  langButtons.forEach(b => {
    b.classList.toggle("active", b.dataset.lang === lang);
  });

  applyLanguageToStaticTexts();
  updatePrixInfo();
  renderMenu();
  setTimeout(activateSearch, 50);
}

// Init boutons langue
langButtons.forEach(btn => {
  btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
});

// Marquer le bouton actif au chargement
langButtons.forEach(btn => {
  btn.classList.toggle("active", btn.dataset.lang === currentLang);
});

// ==========================================
// ============ POPUP ÉVÉNEMENT =============
// ==========================================

const eventBtn = document.getElementById("eventBtn");
const eventPopup = document.getElementById("eventPopup");
const closePopup = document.getElementById("closePopup");

if (eventBtn && eventPopup && closePopup) {
  eventBtn.addEventListener("click", () => {
    eventPopup.style.display = "flex";
  });
  closePopup.addEventListener("click", () => {
    eventPopup.style.display = "none";
  });
  eventPopup.addEventListener("click", e => {
    if (e.target === eventPopup) eventPopup.style.display = "none";
  });
}

// ==========================================
// ============== BURGER MENU ===============
// ==========================================

function closeBurgerMenu() {
  if (!burger || !burgerNav || !burgerOverlay) return;
  burger.classList.remove("active");
  burger.setAttribute("aria-expanded", "false");
  burgerNav.classList.remove("active");
  burgerOverlay.classList.remove("active");
  document.body.classList.remove("no-scroll");
  document.documentElement.classList.remove("no-scroll");
}

if (burger && burgerNav && burgerOverlay) {
  burger.addEventListener("click", () => {
    const isOpen = burgerNav.classList.contains("active");
    isOpen ? closeBurgerMenu() : openBurgerMenu();
  });

  burgerOverlay.addEventListener("click", closeBurgerMenu);

  burgerNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeBurgerMenu);
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && burgerNav.classList.contains("active")) {
      closeBurgerMenu();
    }
  });
}

function openBurgerMenu() {
  if (!burger || !burgerNav || !burgerOverlay) return;
  burger.classList.add("active");
  burger.setAttribute("aria-expanded", "true");
  burgerNav.classList.add("active");
  burgerOverlay.classList.add("active");
  document.body.classList.add("no-scroll");
  document.documentElement.classList.add("no-scroll");
}

// ==========================================
// ========= BOUTON REMONTER EN HAUT & FERMER ======
// ==========================================

// Monitor scroll event to adjust button visibility
window.addEventListener("scroll", updateFloatingButtons, { passive: true });

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if (floatingCloseCategory) {
  floatingCloseCategory.addEventListener("click", () => {
    const openDrawerElement = document.querySelector(".category-drawer.open");
    if (openDrawerElement) {
      closeDrawer(openDrawerElement);
      // Let the drawer close transition start, then smoothly scroll its header to top of viewport
      setTimeout(() => {
        openDrawerElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  });
}

// ==========================================
// ============ BARRE DE RECHERCHE ==========
// ==========================================

function applySearchFilter() {
  const input = document.getElementById("searchInput");
  if (!input) return;

  const term = (input.value || "").toLowerCase().trim();
  const cards = document.querySelectorAll(".menu-item");

  cards.forEach(card => {
    const title = (card.querySelector(".item-name")?.textContent || "").toLowerCase();
    const desc = (card.querySelector(".item-desc")?.textContent || "").toLowerCase();
    const match = !term || title.includes(term) || desc.includes(term);
    card.style.display = match ? "" : "none";
  });

  // Gérer la visibilité et l'ouverture des tiroirs selon la recherche
  const drawers = document.querySelectorAll(".category-drawer");
  drawers.forEach((drawer, idx) => {
    const body = drawer.querySelector(".category-drawer-body");
    const visibles = drawer.querySelectorAll(".menu-item:not([style*='display: none'])");
    
    if (term) {
      if (visibles.length > 0) {
        drawer.style.display = "";
        drawer.classList.add("open");
        if (body) body.style.maxHeight = "none";
      } else {
        drawer.style.display = "none";
        drawer.classList.remove("open");
        if (body) body.style.maxHeight = "0";
      }
    } else {
      // Si la recherche est vide, on affiche tout et on ferme tous les tiroirs
      drawer.style.display = "";
      drawer.classList.remove("open");
      if (body) body.style.maxHeight = "0";
    }
  });
}

function activateSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  // Éviter les doublons de listeners
  searchInput.removeEventListener("input", applySearchFilter);
  searchInput.addEventListener("input", applySearchFilter);

  // Placeholder selon langue
  const placeholders = {
    fr: "Rechercher un plat...",
    en: "Search a dish...",
    de: "Gericht suchen..."
  };
  searchInput.placeholder = placeholders[currentLang] || placeholders.fr;
}

// ==========================================
// ======= BANDE D'ÉVÉNEMENT (LIGHTBOX) =====
// ==========================================

function activateEventBanner() {
  const eventBanner = document.getElementById("eventBanner");
  if (!eventBanner) return;

  const eventImageSrc = eventBanner.dataset.eventImg;
  if (!eventImageSrc) return;

  eventBanner.addEventListener("click", () => {
    const lb = document.getElementById("secureLightbox");
    const lbContent = document.querySelector(".secure-lightbox-content");
    const lbCaption = document.getElementById("secureLightboxCaption");

    if (lb && lbContent) {
      lbContent.style.backgroundImage = `url('${eventImageSrc}')`;

      if (lbCaption) {
        const txt = eventBanner.querySelector(".event-text");
        lbCaption.textContent = txt ? txt.textContent : "Événement Spécial";
      }

      lb.classList.add("active");
      document.body.classList.add("no-scroll");
      document.documentElement.classList.add("no-scroll");
    }
  });
}

// ==========================================
// =========== BOUTON PARTAGER ==============
// ==========================================

const SHARE_TEXTS = {
  fr: {
    title: "Grey Corner — Menu",
    text: "🍽️ Découvrez le menu Grey Corner Café à Fès !",
    copied: "Lien copié ✓"
  },
  en: {
    title: "Grey Corner — Menu",
    text: "🍽️ Discover the Grey Corner Café menu in Fès!",
    copied: "Link copied ✓"
  },
  de: {
    title: "Grey Corner — Menü",
    text: "🍽️ Entdecken Sie das Menü des Grey Corner Café in Fès!",
    copied: "Link kopiert ✓"
  }
};

function showToast(msg) {
  const toast = document.getElementById("scToast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2400);
}

async function partagerMenu() {
  const url = window.location.href;
  const s = SHARE_TEXTS[currentLang] || SHARE_TEXTS.fr;

  // Web Share API (mobile natif — WhatsApp, SMS, AirDrop…)
  if (navigator.share) {
    try {
      await navigator.share({ title: s.title, text: s.text, url });
      return;
    } catch (e) {
      // Annulé par l'utilisateur → rien à faire
      return;
    }
  }

  // Fallback desktop : copier dans le presse-papier
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    // Dernier recours pour vieux navigateurs
    const ta = document.createElement("textarea");
    ta.value = url;
    ta.style.cssText = "position:fixed;opacity:0;top:0;left:0;";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }

  showToast(s.copied);
}

// Attacher le bouton partager (défini dans le HTML)
const shareBtn = document.getElementById("shareMenu");
if (shareBtn) {
  shareBtn.addEventListener("click", partagerMenu);
}

// ==========================================
// ================ INITIAL LOAD ============
// ==========================================

// Appliquer la langue détectée dès le départ
applyLanguageToStaticTexts();
updatePrixInfo();

// Rendre le menu
renderMenu();

// Setup accordion navigation and handle initial hash if present
setupNavigationListeners();
setTimeout(handleHashNavigation, 100);

// Activer la recherche après render
setTimeout(activateSearch, 50);

// Activer la bannière événement
activateEventBanner();

// ============================================================================
// GREY CORNER — CLIENT CONNECTED SERVICE LOGIC (REAL-TIME & CART ENGINE)
// ============================================================================

let clientCart = [];
let clientTable = null;

// Initialize Client Cart from LocalStorage
function initClientCart() {
  try {
    clientCart = JSON.parse(localStorage.getItem("grey_cart") || "[]");
  } catch (e) {
    clientCart = [];
  }
  updateCartUI();
}

// Save Cart to LocalStorage
function saveClientCart() {
  localStorage.setItem("grey_cart", JSON.stringify(clientCart));
  updateCartUI();
}

// Global state for drink selection modal
let selectedMenuItem = null;

const HOT_DRINKS_OPTIONS = [
  { fr: "Café Séparé", en: "Separated Coffee", de: "Getrennter Kaffee" },
  { fr: "Lait Froid", en: "Cold Milk", de: "Kalte Milch" },
  { fr: "Lait Chaud", en: "Hot Milk", de: "Warme Milch" },
  { fr: "Café Noir", en: "Black Coffee", de: "Schwarzer Kaffee" },
  { fr: "Cappuccino Italien", en: "Italian Cappuccino", de: "Italienischer Cappuccino" },
  { fr: "Café Cassé", en: "Café Cassé", de: "Café Cassé" },
  { fr: "Jus d'Orange", en: "Orange Juice", de: "Orangensaft" },
  { fr: "Lait Cassé", en: "Lait Cassé", de: "Lait Cassé" },
  { fr: "Café Moitié", en: "Half Coffee", de: "Halber Kaffee" },
  { fr: "Chocolat au Lait", en: "Milk Chocolate", de: "Milchschokolade" },
  { fr: "Café Américain", en: "Americano Coffee", de: "Kaffee Americano" },
  { fr: "Café au Lait", en: "Coffee with Milk", de: "Milchkaffee" },
  { fr: "Thé à la Menthe", en: "Mint Tea", de: "Minztee" },
  { fr: "Thé Noir", en: "Black Tea", de: "Schwarzer Tee" },
  { fr: "Thé Noir au Lait", en: "Black Tea with Milk", de: "Schwarzer Tee mit Milch" },
  { fr: "Verveine", en: "Verbena Infusion", de: "Eisenkraut Tee" }
];

// Add Item to Cart
const SIDES_OPTIONS = [
  { fr: "Légumes sautés", en: "Sautéed vegetables", de: "Sautiertes Gemüse" },
  { fr: "Riz", en: "Rice", de: "Reis" },
  { fr: "Frites", en: "French Fries", de: "Pommes Frites" },
  { fr: "Purée pomme de terre", en: "Mashed potatoes", de: "Kartoffelpüree" },
  { fr: "Potatos", en: "Potato Wedges", de: "Spaltenkartoffeln" }
];

const PASTA_OPTIONS = [
  { fr: "Rigatoni", en: "Rigatoni", de: "Rigatoni" },
  { fr: "Tagliatelles", en: "Tagliatelle", de: "Tagliatelle" },
  { fr: "Spaghettis", en: "Spaghetti", de: "Spaghetti" },
  { fr: "Linguines", en: "Linguine", de: "Linguine" }
];

function addToCart(menuItem) {
  // Check if it belongs to BREAKFAST (PETIT DÉJEUNER) category and is not Kids Menu
  if (menuItem.categoryId === "petit-dejeuner" && menuItem.name.fr !== "MENU ENFANT") {
    openHotDrinkSelectorModal(menuItem);
    return;
  }

  // Check if it is a pasta dish (excluding lasagnas and black spaghetti)
  if (menuItem.categoryId === "pasta" && !menuItem.name.fr.toUpperCase().includes("LASAGNE") && !menuItem.name.fr.toUpperCase().includes("SPAGHETTIS NOIRS")) {
    openPastaSelectorModal(menuItem);
    return;
  }

  // Check if it belongs to PLATS category OR is the ACCOMPAGNEMENTS item
  if (menuItem.categoryId === "plats" || menuItem.name.fr.toUpperCase().includes("ACCOMPAGN")) {
    openSidesSelectorModal(menuItem);
    return;
  }

  executeAddToCartWithChoices(menuItem, null);
}

function openSidesSelectorModal(menuItem) {
  selectedMenuItem = menuItem;
  const modal = document.getElementById("sidesModalOverlay");
  if (!modal) return;

  modal.style.display = "flex";

  const limit = 2; // Always 2 sides!

  // Wire close button
  const closeBtn = document.getElementById("sidesCloseBtn");
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.style.display = "none";
    };
  }

  renderSidesList(limit);
}

function renderSidesList(limit) {
  const listContainer = document.getElementById("sidesList");
  if (!listContainer) return;
  listContainer.innerHTML = "";

  const counts = {};
  SIDES_OPTIONS.forEach((d, idx) => {
    counts[idx] = 0;
  });

  function updateListUI() {
    const totalSelected = Object.values(counts).reduce((a, b) => a + b, 0);

    const counterEl = document.getElementById("sidesCounter");
    const counterTexts = {
      fr: `Sélection : ${totalSelected} / ${limit}`,
      en: `Selection: ${totalSelected} / ${limit}`,
      de: `Auswahl: ${totalSelected} / ${limit}`
    };
    if (counterEl) {
      counterEl.textContent = counterTexts[currentLang] || counterTexts.fr;
    }

    const confirmBtn = document.getElementById("sidesConfirmBtn");
    if (confirmBtn) {
      confirmBtn.disabled = (totalSelected !== limit);
    }

    SIDES_OPTIONS.forEach((side, idx) => {
      const row = listContainer.querySelector(`[data-index="${idx}"]`);
      if (row) {
        const countVal = counts[idx];
        const countDisplay = row.querySelector(".hdo-qty");
        const decBtn = row.querySelector(".hdo-dec");
        const incBtn = row.querySelector(".hdo-inc");

        if (countDisplay) countDisplay.textContent = countVal;

        if (countVal > 0) {
          row.classList.add("selected");
        } else {
          row.classList.remove("selected");
        }

        if (decBtn) decBtn.disabled = (countVal === 0);
        if (incBtn) incBtn.disabled = (totalSelected >= limit);
      }
    });
  }

  SIDES_OPTIONS.forEach((side, idx) => {
    const item = document.createElement("div");
    item.className = "hdo-item";
    item.dataset.index = idx;

    item.innerHTML = `
            <div class="hdo-name">${side[currentLang] || side.fr}</div>
            <div style="display: flex; align-items: center; gap: 12px; z-index: 10;">
                <button class="tgs-btn hdo-dec" style="width: 28px; height: 28px; border-radius: 6px; font-size: 1rem; line-height: 1; aspect-ratio: auto; font-weight: bold; background: var(--bg);" disabled>-</button>
                <span class="hdo-qty" style="font-family: 'Poppins', sans-serif; font-size: 0.95rem; font-weight: 600; color: var(--text); min-width: 14px; text-align: center;">0</span>
                <button class="tgs-btn hdo-inc" style="width: 28px; height: 28px; border-radius: 6px; font-size: 1rem; line-height: 1; aspect-ratio: auto; font-weight: bold; background: var(--bg);">+</button>
            </div>
        `;

    const decBtn = item.querySelector(".hdo-dec");
    const incBtn = item.querySelector(".hdo-inc");

    decBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (counts[idx] > 0) {
        counts[idx]--;
        updateListUI();
      }
    });

    incBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      if (total < limit) {
        counts[idx]++;
        updateListUI();
      }
    });

    item.addEventListener("click", () => {
      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      if (total < limit) {
        counts[idx]++;
        updateListUI();
      } else if (counts[idx] > 0 && limit === 1) {
        counts[idx] = 0;
        updateListUI();
      } else if (limit === 1) {
        SIDES_OPTIONS.forEach((_, i) => counts[i] = 0);
        counts[idx] = 1;
        updateListUI();
      }
    });

    listContainer.appendChild(item);
  });

  updateListUI();

  const confirmBtn = document.getElementById("sidesConfirmBtn");
  confirmBtn.onclick = () => {
    const finalChoices = [];
    SIDES_OPTIONS.forEach((side, idx) => {
      const qty = counts[idx];
      for (let k = 0; k < qty; k++) {
        finalChoices.push(side[currentLang] || side.fr);
      }
    });

    const modal = document.getElementById("sidesModalOverlay");
    if (modal) modal.style.display = "none";

    executeAddToCartWithChoices(selectedMenuItem, finalChoices);
  };
}

function openPastaSelectorModal(menuItem) {
  selectedMenuItem = menuItem;
  const modal = document.getElementById("pastaModalOverlay");
  if (!modal) return;

  modal.style.display = "flex";

  const limit = 1;

  // Update labels and subtitle based on language
  const titleEl = document.getElementById("pastaModalTitle");
  const subtitleEl = document.getElementById("pastaModalSubtitle");

  const titles = {
    fr: "Choisissez votre type de pâtes",
    en: "Choose your type of pasta",
    de: "Wählen Sie Ihre Nudelsorte"
  };

  const subtitles = {
    fr: `Veuillez sélectionner le type de pâtes pour votre plat "${menuItem.name[currentLang]}".`,
    en: `Please select the pasta type for your "${menuItem.name[currentLang]}" dish.`,
    de: `Bitte wählen Sie die Nudelsorte für Ihr Gericht "${menuItem.name[currentLang]}".`
  };

  if (titleEl) titleEl.textContent = titles[currentLang] || titles.fr;
  if (subtitleEl) subtitleEl.textContent = subtitles[currentLang] || subtitles.fr;

  // Setup close listeners once
  const closeBtn = document.getElementById("pastaCloseBtn");
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.style.display = "none";
    };
  }
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  };

  renderPastaList(limit);
}

function renderPastaList(limit) {
  const listContainer = document.getElementById("pastaList");
  if (!listContainer) return;
  listContainer.innerHTML = "";

  const counts = {};
  PASTA_OPTIONS.forEach((d, idx) => {
    counts[idx] = 0;
  });

  function updateListUI() {
    const totalSelected = Object.values(counts).reduce((a, b) => a + b, 0);

    const counterEl = document.getElementById("pastaCounter");
    const counterTexts = {
      fr: `Sélection : ${totalSelected} / ${limit}`,
      en: `Selection: ${totalSelected} / ${limit}`,
      de: `Auswahl: ${totalSelected} / ${limit}`
    };
    if (counterEl) {
      counterEl.textContent = counterTexts[currentLang] || counterTexts.fr;
    }

    const confirmBtn = document.getElementById("pastaConfirmBtn");
    if (confirmBtn) {
      confirmBtn.disabled = (totalSelected !== limit);
    }

    PASTA_OPTIONS.forEach((pasta, idx) => {
      const row = listContainer.querySelector(`[data-index="${idx}"]`);
      if (row) {
        const countVal = counts[idx];
        const countDisplay = row.querySelector(".hdo-qty");
        const decBtn = row.querySelector(".hdo-dec");
        const incBtn = row.querySelector(".hdo-inc");

        if (countDisplay) countDisplay.textContent = countVal;

        if (countVal > 0) {
          row.classList.add("selected");
        } else {
          row.classList.remove("selected");
        }

        if (decBtn) decBtn.disabled = (countVal === 0);
        if (incBtn) incBtn.disabled = (totalSelected >= limit);
      }
    });
  }

  PASTA_OPTIONS.forEach((pasta, idx) => {
    const item = document.createElement("div");
    item.className = "hdo-item";
    item.dataset.index = idx;

    item.innerHTML = `
            <div class="hdo-name">${pasta[currentLang] || pasta.fr}</div>
            <div style="display: flex; align-items: center; gap: 12px; z-index: 10;">
                <button class="tgs-btn hdo-dec" style="width: 28px; height: 28px; border-radius: 6px; font-size: 1rem; line-height: 1; aspect-ratio: auto; font-weight: bold; background: var(--bg);" disabled>-</button>
                <span class="hdo-qty" style="font-family: 'Poppins', sans-serif; font-size: 0.95rem; font-weight: 600; color: var(--text); min-width: 14px; text-align: center;">0</span>
                <button class="tgs-btn hdo-inc" style="width: 28px; height: 28px; border-radius: 6px; font-size: 1rem; line-height: 1; aspect-ratio: auto; font-weight: bold; background: var(--bg);">+</button>
            </div>
        `;

    const decBtn = item.querySelector(".hdo-dec");
    const incBtn = item.querySelector(".hdo-inc");

    decBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (counts[idx] > 0) {
        counts[idx]--;
        updateListUI();
      }
    });

    incBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      if (total < limit) {
        counts[idx]++;
        updateListUI();
      }
    });

    item.addEventListener("click", () => {
      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      if (total < limit) {
        counts[idx]++;
        updateListUI();
      } else if (counts[idx] > 0 && limit === 1) {
        counts[idx] = 0;
        updateListUI();
      } else if (limit === 1) {
        PASTA_OPTIONS.forEach((_, i) => counts[i] = 0);
        counts[idx] = 1;
        updateListUI();
      }
    });

    listContainer.appendChild(item);
  });

  updateListUI();

  const confirmBtn = document.getElementById("pastaConfirmBtn");
  confirmBtn.onclick = () => {
    const finalChoices = [];
    PASTA_OPTIONS.forEach((pasta, idx) => {
      const qty = counts[idx];
      for (let k = 0; k < qty; k++) {
        finalChoices.push(pasta[currentLang] || pasta.fr);
      }
    });

    const modal = document.getElementById("pastaModalOverlay");
    if (modal) modal.style.display = "none";

    executeAddToCartWithChoices(selectedMenuItem, finalChoices);
  };
}

function openHotDrinkSelectorModal(menuItem) {
  selectedMenuItem = menuItem;
  const modal = document.getElementById("hotDrinkModalOverlay");
  if (!modal) return;

  modal.style.display = "flex";

  // Determine required drinks
  const isBrunchDuo = (menuItem.name.fr === "BRUNCH DUO");
  const limit = isBrunchDuo ? 2 : 1;

  // Update labels and subtitle based on language
  const titleEl = document.getElementById("hotDrinkModalTitle");
  const subtitleEl = document.getElementById("hotDrinkModalSubtitle");

  const titles = {
    fr: isBrunchDuo ? "Sélectionnez 2 Boissons Chaudes" : "Choisissez votre Boisson Chaude",
    en: isBrunchDuo ? "Select 2 Hot Beverages" : "Choose Your Hot Beverage",
    de: isBrunchDuo ? "Wählen Sie 2 Heißgetränke" : "Wählen Sie Ihr Heißgetränk"
  };

  const subtitles = {
    fr: `Votre menu "${menuItem.name[currentLang]}" comprend ${limit} boisson(s) chaude(s) au choix.`,
    en: `Your "${menuItem.name[currentLang]}" menu includes ${limit} choice(s) of hot beverage.`,
    de: `Ihr Menü "${menuItem.name[currentLang]}" beinhaltet ${limit} Heißgetränk(e) nach Wahl.`
  };

  if (titleEl) titleEl.textContent = titles[currentLang] || titles.fr;
  if (subtitleEl) subtitleEl.textContent = subtitles[currentLang] || subtitles.fr;

  // Setup close listeners once
  const closeBtn = document.getElementById("hotDrinkCloseBtn");
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.style.display = "none";
    };
  }
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  };

  renderHotDrinksList(limit);
}

function renderHotDrinksList(limit) {
  const listContainer = document.getElementById("hotDrinksList");
  if (!listContainer) return;
  listContainer.innerHTML = "";

  const counts = {};
  HOT_DRINKS_OPTIONS.forEach((d, idx) => {
    counts[idx] = 0;
  });

  function updateListUI() {
    const totalSelected = Object.values(counts).reduce((a, b) => a + b, 0);

    const counterEl = document.getElementById("hotDrinkCounter");
    const counterTexts = {
      fr: `Sélection : ${totalSelected} / ${limit}`,
      en: `Selection: ${totalSelected} / ${limit}`,
      de: `Auswahl: ${totalSelected} / ${limit}`
    };
    if (counterEl) {
      counterEl.textContent = counterTexts[currentLang] || counterTexts.fr;
    }

    const confirmBtn = document.getElementById("hotDrinkConfirmBtn");
    if (confirmBtn) {
      confirmBtn.disabled = (totalSelected !== limit);
    }

    HOT_DRINKS_OPTIONS.forEach((drink, idx) => {
      const row = listContainer.querySelector(`[data-index="${idx}"]`);
      if (row) {
        const countVal = counts[idx];
        const countDisplay = row.querySelector(".hdo-qty");
        const decBtn = row.querySelector(".hdo-dec");
        const incBtn = row.querySelector(".hdo-inc");

        if (countDisplay) countDisplay.textContent = countVal;

        if (countVal > 0) {
          row.classList.add("selected");
        } else {
          row.classList.remove("selected");
        }

        if (decBtn) decBtn.disabled = (countVal === 0);
        if (incBtn) incBtn.disabled = (totalSelected >= limit);
      }
    });
  }

  HOT_DRINKS_OPTIONS.forEach((drink, idx) => {
    const item = document.createElement("div");
    item.className = "hdo-item";
    item.dataset.index = idx;

    item.innerHTML = `
            <div class="hdo-name">${drink[currentLang] || drink.fr}</div>
            <div style="display: flex; align-items: center; gap: 12px; z-index: 10;">
                <button class="tgs-btn hdo-dec" style="width: 28px; height: 28px; border-radius: 6px; font-size: 1rem; line-height: 1; aspect-ratio: auto; font-weight: bold; background: var(--bg);" disabled>-</button>
                <span class="hdo-qty" style="font-family: 'Poppins', sans-serif; font-size: 0.95rem; font-weight: 600; color: var(--text); min-width: 14px; text-align: center;">0</span>
                <button class="tgs-btn hdo-inc" style="width: 28px; height: 28px; border-radius: 6px; font-size: 1rem; line-height: 1; aspect-ratio: auto; font-weight: bold; background: var(--bg);">+</button>
            </div>
        `;

    const decBtn = item.querySelector(".hdo-dec");
    const incBtn = item.querySelector(".hdo-inc");

    decBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (counts[idx] > 0) {
        counts[idx]--;
        updateListUI();
      }
    });

    incBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      if (total < limit) {
        counts[idx]++;
        updateListUI();
      }
    });

    item.addEventListener("click", () => {
      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      if (total < limit) {
        counts[idx]++;
        updateListUI();
      } else if (counts[idx] > 0 && limit === 1) {
        counts[idx] = 0;
        updateListUI();
      } else if (limit === 1) {
        HOT_DRINKS_OPTIONS.forEach((_, i) => counts[i] = 0);
        counts[idx] = 1;
        updateListUI();
      }
    });

    listContainer.appendChild(item);
  });

  updateListUI();

  const confirmBtn = document.getElementById("hotDrinkConfirmBtn");
  confirmBtn.onclick = () => {
    const finalChoices = [];
    HOT_DRINKS_OPTIONS.forEach((drink, idx) => {
      const qty = counts[idx];
      for (let k = 0; k < qty; k++) {
        finalChoices.push(drink[currentLang] || drink.fr);
      }
    });

    const modal = document.getElementById("hotDrinkModalOverlay");
    if (modal) modal.style.display = "none";

    executeAddToCartWithChoices(selectedMenuItem, finalChoices);
  };
}

function executeAddToCartWithChoices(menuItem, drinkChoices) {
  let cartItemId = menuItem.name.fr;
  if (drinkChoices && drinkChoices.length > 0) {
    cartItemId += `_${drinkChoices.join('_')}`;
  }

  const existingIndex = clientCart.findIndex(item => item.id === cartItemId);
  if (existingIndex !== -1) {
    clientCart[existingIndex].qty += 1;
  } else {
    clientCart.push({
      id: cartItemId,
      name: menuItem.name,
      price: parseFloat(menuItem.price) || 0,
      image: menuItem.image,
      qty: 1,
      note: "",
      drinkChoices: drinkChoices
    });
  }
  saveClientCart();

  const toastMsgs = {
    fr: "Ajouté au panier !",
    en: "Added to basket !",
    de: "In den Korb gelegt !"
  };
  showToast(`${menuItem.name[currentLang]} — ${toastMsgs[currentLang] || toastMsgs.fr}`);
}

// Update Cart Badge, Totals, and Items List
function updateCartUI() {
  const badge = document.getElementById("cabCartBadge");
  const totalItems = clientCart.reduce((sum, item) => sum + item.qty, 0);

  if (badge) {
    if (totalItems > 0) {
      badge.textContent = totalItems;
      badge.style.display = "flex";
    } else {
      badge.style.display = "none";
    }
  }

  // Update Drawer Elements if open
  const cdItemsList = document.getElementById("cdItemsList");
  const cdEmptyState = document.getElementById("cdEmptyState");
  const cdNotesSection = document.getElementById("cdNotesSection");
  const cdFooter = document.getElementById("cdFooter");
  const cdTotalPrice = document.getElementById("cdTotalPrice");

  if (cdItemsList) {
    if (clientCart.length === 0) {
      cdItemsList.innerHTML = "";
      if (cdEmptyState) cdEmptyState.style.display = "flex";
      if (cdNotesSection) cdNotesSection.style.display = "none";
      if (cdFooter) cdFooter.style.display = "none";
    } else {
      if (cdEmptyState) cdEmptyState.style.display = "none";
      if (cdNotesSection) cdNotesSection.style.display = "flex";
      if (cdFooter) cdFooter.style.display = "block";

      cdItemsList.innerHTML = "";
      clientCart.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "cd-item";
        itemDiv.innerHTML = `
                    <div class="cd-item-img" style="background-image: url('${item.image}')"></div>
                    <div class="cd-item-details">
                        <h4 class="cd-item-name">${item.name[currentLang]}</h4>
                        ${(() => {
            if (!item.drinkChoices || item.drinkChoices.length === 0) return '';
            const isSide = item.drinkChoices[0].includes("fr") ||
              item.drinkChoices[0].includes("Frit") ||
              item.drinkChoices[0].includes("Riz") ||
              item.drinkChoices[0].includes("Rice") ||
              item.drinkChoices[0].includes("Reis") ||
              item.drinkChoices[0].includes("Légum") ||
              item.drinkChoices[0].includes("vege") ||
              item.drinkChoices[0].includes("Gemü") ||
              item.drinkChoices[0].includes("Potato") ||
              item.drinkChoices[0].includes("Puré") ||
              item.drinkChoices[0].includes("Mash") ||
              item.drinkChoices[0].includes("Karto") ||
              item.drinkChoices[0].includes("Spalten");
            
            const isPasta = item.drinkChoices[0].includes("Rigatoni") ||
              item.drinkChoices[0].includes("Tagliatelle") ||
              item.drinkChoices[0].includes("Spaghetti") ||
              item.drinkChoices[0].includes("Linguine");

            const emoji = isSide ? '🥗' : (isPasta ? '🍝' : '☕');
            return `<div style="font-size: 0.75rem; color: var(--sc-gold-light); font-style: italic; margin-top: 2px;">${emoji} ${item.drinkChoices.join(', ')}</div>`;
          })()}
                        <span class="cd-item-price">${item.price} MAD</span>
                    </div>
                    <div class="cd-item-actions">
                        <div class="cd-qty-wrap">
                            <button class="cd-qty-btn decrease-btn" data-id="${item.id}">-</button>
                            <span class="cd-qty-num">${item.qty}</span>
                            <button class="cd-qty-btn increase-btn" data-id="${item.id}">+</button>
                        </div>
                        <button class="cd-remove-btn" data-id="${item.id}" aria-label="Supprimer">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                `;

        // Qty decrease
        itemDiv.querySelector(".decrease-btn").addEventListener("click", () => {
          const idx = clientCart.findIndex(c => c.id === item.id);
          if (idx !== -1) {
            if (clientCart[idx].qty > 1) {
              clientCart[idx].qty -= 1;
            } else {
              clientCart.splice(idx, 1);
            }
            saveClientCart();
          }
        });

        // Qty increase
        itemDiv.querySelector(".increase-btn").addEventListener("click", () => {
          const idx = clientCart.findIndex(c => c.id === item.id);
          if (idx !== -1) {
            clientCart[idx].qty += 1;
            saveClientCart();
          }
        });

        // Remove item
        itemDiv.querySelector(".cd-remove-btn").addEventListener("click", () => {
          const idx = clientCart.findIndex(c => c.id === item.id);
          if (idx !== -1) {
            clientCart.splice(idx, 1);
            saveClientCart();
          }
        });

        cdItemsList.appendChild(itemDiv);
      });

      // Compute total
      const totalPrice = clientCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      if (cdTotalPrice) cdTotalPrice.textContent = `${totalPrice} MAD`;
    }
  }
}

// Open/Close Cart Drawer
function openCartDrawer() {
  const overlay = document.getElementById("cartDrawerOverlay");
  const drawer = document.getElementById("cartDrawer");

  updateCartUI();
  if (overlay && drawer) {
    overlay.classList.add("active");
    drawer.classList.add("active");
    document.body.classList.add("no-scroll");
  }
}

function closeCartDrawer() {
  const overlay = document.getElementById("cartDrawerOverlay");
  const drawer = document.getElementById("cartDrawer");
  if (overlay && drawer) {
    overlay.classList.remove("active");
    drawer.classList.remove("active");
    document.body.classList.remove("no-scroll");
  }
}

// Helper to validate physical tables in Fès layout
function isValidTableNumber(num) {
  const table = parseInt(num);
  if (isNaN(table)) return false;
  if (table >= 101 && table <= 115) return true; // Salon
  if (table >= 201 && table <= 223) return true; // Loge
  if (table >= 301 && table <= 324) return true; // Terrasse
  return false;
}

// Helper to get Table Zone Name based on physical layout
function getTableZoneName(tableNum) {
  const num = parseInt(tableNum);
  if (num >= 101 && num <= 115) return "Salon";
  if (num >= 201 && num <= 223) return "Loge";
  if (num >= 301 && num <= 324) return "Terrasse";
  return "Table";
}

let pendingActionAfterTableSelect = null;

// Parse Table Number
function detectTableNumber() {
  // Clear any residual table numbers from old versions to ensure zero browser memory persistence
  localStorage.removeItem("grey_table");

  const urlParams = new URLSearchParams(window.location.search);
  let table = urlParams.get("table");

  if (table) {
    table = parseInt(table);
    if (isValidTableNumber(table)) {
      setTable(table);
      return;
    }
  }

  // DO NOT show modal on startup. Just let the user browse.
}

function setTable(num) {
  clientTable = num;

  // Update Badge text
  const badge = document.getElementById("cdTableBadge");
  if (badge) {
    badge.textContent = `${getTableZoneName(num)} — ${num}`;
  }

  // Update URL query string smoothly without refreshing
  const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?table=${num}`;
  window.history.pushState({ path: newUrl }, '', newUrl);

  // Hide fallback selector
  const modal = document.getElementById("tableModalOverlay");
  if (modal) modal.style.display = "none";

  const actionBar = document.getElementById("clientActionBar");
  if (actionBar) actionBar.style.display = "block";

  // Show premium floating notification bell button
  const bellBtn = document.getElementById("notificationBellBtn");
  if (bellBtn) bellBtn.style.display = "flex";

  const ndTableBadge = document.getElementById("ndTableBadge");
  if (ndTableBadge) {
    ndTableBadge.textContent = `${getTableZoneName(num)} — ${num}`;
  }

  // Begin listening for waiter actions
  subscribeToActiveWaiterEvents();

  // Execute pending action if any
  if (typeof pendingActionAfterTableSelect === "function") {
    const action = pendingActionAfterTableSelect;
    pendingActionAfterTableSelect = null;
    setTimeout(action, 200);
  }
}

function showTableSelectorModal() {
  const modal = document.getElementById("tableModalOverlay");
  const grid = document.getElementById("tableGridSelect");

  if (modal && grid) {
    modal.style.display = "flex";
    grid.innerHTML = "";

    const zones = [
      { name: "Salon", start: 101, end: 115 },
      { name: "Loge", start: 201, end: 223 },
      { name: "Terrasse", start: 301, end: 324 }
    ];

    zones.forEach(zone => {
      const wrapper = document.createElement("div");
      wrapper.style.display = "flex";
      wrapper.style.flexDirection = "column";
      wrapper.style.gap = "8px";
      wrapper.style.width = "100%";

      const title = document.createElement("div");
      title.style.fontFamily = "'DM Sans', sans-serif";
      title.style.fontSize = "0.75rem";
      title.style.fontWeight = "700";
      title.style.letterSpacing = "0.08em";
      title.style.color = "var(--sc-gold-light)";
      title.style.textTransform = "uppercase";
      title.style.textAlign = "left";
      title.style.borderBottom = "1px solid var(--sc-border)";
      title.style.paddingBottom = "4px";
      title.style.marginBottom = "4px";
      title.textContent = zone.name;

      const btnGrid = document.createElement("div");
      btnGrid.style.display = "grid";
      btnGrid.style.gridTemplateColumns = "repeat(4, 1fr)";
      btnGrid.style.gap = "6px";

      for (let i = zone.start; i <= zone.end; i++) {
        const btn = document.createElement("button");
        btn.className = "tgs-btn";
        btn.textContent = i;
        btn.addEventListener("click", () => setTable(i));
        btnGrid.appendChild(btn);
      }

      wrapper.appendChild(title);
      wrapper.appendChild(btnGrid);
      grid.appendChild(wrapper);
    });
  }
}

// Anonymous Auth for Firebase if active
function initClientFirebaseSession(callback) {
  if (dbService.isCloud()) {
    firebase.auth().signInAnonymously()
      .then(() => {
        console.log("🔒 Client anonymously authenticated securely.");
        if (callback) callback();
      })
      .catch(e => {
        console.warn("🔒 Offline/Security anonymous session stub active.", e.message);
        if (callback) callback();
      });
  } else {
    if (callback) callback();
  }
}

// Cooldown Abuse limits (seconds)
const COOLDOWN_SECONDS = 90;

function checkCallCooldown(type) {
  const key = `cooldown_${type}`;
  const lastCall = localStorage.getItem(key);
  if (lastCall) {
    const elapsed = (Date.now() - parseInt(lastCall)) / 1000;
    if (elapsed < COOLDOWN_SECONDS) {
      return Math.ceil(COOLDOWN_SECONDS - elapsed);
    }
  }
  return 0;
}

function setCallCooldown(type) {
  localStorage.setItem(`cooldown_${type}`, Date.now().toString());
}

// GPS / Location Security action wrapper
function verifyLocationAndProceed(action, onFailure) {
  if (GPSService.isSuspicious) {
    const suspectMsgs = {
      fr: "Position GPS invalide détectée.",
      en: "Suspicious GPS location detected.",
      de: "Verdächtige GPS-Position erkannt."
    };
    showToast(suspectMsgs[currentLang] || suspectMsgs.fr);
    if (typeof onFailure === "function") onFailure();
    return;
  }

  if (!GPSService.isInside) {
    const outMsgs = {
      fr: "Vous devez être présent chez Grey Corner pour utiliser les services de commande.",
      en: "You must be present at Grey Corner to use ordering services.",
      de: "Sie müssen im Grey Corner anwesend sein, um die Bestelldienste zu nutzen."
    };
    showToast(outMsgs[currentLang] || outMsgs.fr);
    if (typeof onFailure === "function") onFailure();
    return;
  }

  // Instant verification callback
  GPSService.checkLocation(false, (isInside) => {
    if (GPSService.isSuspicious) {
      const suspectMsgs = {
        fr: "Position GPS invalide détectée.",
        en: "Suspicious GPS location detected.",
        de: "Verdächtige GPS-Position erkannt."
      };
      showToast(suspectMsgs[currentLang] || suspectMsgs.fr);
      if (typeof onFailure === "function") onFailure();
      return;
    }

    if (isInside) {
      action();
    } else {
      const outMsgs = {
        fr: "Vous devez être présent chez Grey Corner pour utiliser les services de commande.",
        en: "You must be present at Grey Corner to use ordering services.",
        de: "Sie müssen im Grey Corner anwesend sein, um die Bestelldienste zu nutzen."
      };
      showToast(outMsgs[currentLang] || outMsgs.fr);
      if (typeof onFailure === "function") onFailure();
    }
  });
}

// Trigger calling server
function triggerQuickServiceCall(type) {
  if (systemFrozen) {
    const frozenToast = {
      fr: "Le service est temporairement suspendu en raison d'une forte affluence ❄️",
      en: "Service is temporarily suspended due to high demand ❄️",
      de: "Der Dienst ist wegen hoher Nachfrage vorübergehend eingestellt ❄️"
    };
    showToast(frozenToast[currentLang] || frozenToast.fr);
    return;
  }
  verifyLocationAndProceed(() => {
    if (!clientTable) {
      pendingActionAfterTableSelect = () => triggerQuickServiceCall(type);
      showTableSelectorModal();
      return;
    }

    const waitRemaining = checkCallCooldown(type);
    if (waitRemaining > 0) {
      const errorMsgs = {
        fr: `Veuillez attendre ${waitRemaining}s avant de renouveler cet appel.`,
        en: `Please wait ${waitRemaining}s before repeating this request.`,
        de: `Bitte warten Sie ${waitRemaining}s, bevor Sie diese Anfrage wiederholen.`
      };
      showToast(errorMsgs[currentLang] || errorMsgs.fr);
      return;
    }

    // Set interactive loader state on button
    const btnId = type === "waiter" ? "cabCallWaiter" : (type === "water" ? "cabRequestWater" : "cabRequestBill");
    const btn = document.getElementById(btnId);
    if (btn) btn.classList.add("active");

    dbService.sendCall(clientTable, type, (success, callId) => {
      if (btn) btn.classList.remove("active");

      if (success) {
        setCallCooldown(type);

        // Custom Toast feedback
        const okMsgs = {
          fr: "Appel envoyé ! Votre serveur a été alerté.",
          en: "Call sent! Your waiter has been alerted.",
          de: "Anruf gesendet! Ihr Kellner wurde benachrichtigt."
        };
        showToast(okMsgs[currentLang] || okMsgs.fr);

        // Store call ID locally to track state
        localStorage.setItem(`last_call_${type}`, callId);
      } else {
        showToast("Erreur de connexion. Veuillez réessayer.");
      }
    });
  });
}

// Send Pre-Order
function submitPreOrder() {
  if (systemFrozen) {
    const frozenToast = {
      fr: "Le service est temporairement suspendu en raison d'une forte affluence ❄️",
      en: "Service is temporarily suspended due to high demand ❄️",
      de: "Der Dienst ist wegen hoher Nachfrage vorübergehend eingestellt ❄️"
    };
    showToast(frozenToast[currentLang] || frozenToast.fr);
    return;
  }
  if (clientCart.length === 0) return;

  const btn = document.getElementById("cdSubmitBtn");
  const spinner = document.getElementById("cdSubmitSpinner");

  if (btn) {
    if (btn.disabled) return;
    btn.disabled = true;
  }
  if (spinner) spinner.style.display = "block";

  const resetBtn = () => {
    if (btn) btn.disabled = false;
    if (spinner) spinner.style.display = "none";
  };

  verifyLocationAndProceed(() => {
    if (!clientTable) {
      resetBtn();
      pendingActionAfterTableSelect = () => submitPreOrder();
      showTableSelectorModal();
      return;
    }

    const note = document.getElementById("cdSpecialNote") ? document.getElementById("cdSpecialNote").value : "";
    const totalPrice = clientCart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Format items list for database
    const itemsList = clientCart.map(c => {
      let nameFr = c.name.fr;
      let nameLang = c.name[currentLang] || c.name.fr;
      if (c.drinkChoices && c.drinkChoices.length > 0) {
        const choicesStr = ` (${c.drinkChoices.join(', ')})`;
        nameFr += choicesStr;
        nameLang += choicesStr;
      }
      return {
        name: nameFr,
        name_lang: nameLang,
        price: c.price.toString(),
        qty: c.qty,
        note: c.note || ""
      };
    });

    dbService.sendPreOrder(clientTable, itemsList, note, totalPrice, (success, orderId) => {
      resetBtn();

      if (success) {
        // Success Chime (Luxury sound)
        try {
          const chime = new Audio("https://assets.mixkit.co/active_storage/sfx/911/911-200.wav");
          chime.volume = 0.4;
          chime.play();
        } catch (e) { }

        // Success feedback toast
        const okMsgs = {
          fr: "Précommande envoyée ! Le serveur arrive la confirmer.",
          en: "Pre-order sent! The waiter is coming to confirm.",
          de: "Vorbestellung gesendet! Der Kellner kommt zur Bestätigung."
        };
        showToast(okMsgs[currentLang] || okMsgs.fr);

        // Clear Cart
        clientCart = [];
        saveClientCart();
        if (document.getElementById("cdSpecialNote")) {
          document.getElementById("cdSpecialNote").value = "";
        }

        closeCartDrawer();

        // Save last order ID
        localStorage.setItem("last_pre_order_id", orderId);
      } else {
        showToast("Erreur de connexion. Veuillez réessayer.");
      }
    });
  }, resetBtn);
}


// Subscribe to Active Waiter Events for Real-Time feedback toast (e.g. Karim has accepted the call)
let unsubscribersList = [];

function subscribeToActiveWaiterEvents() {
  // Clear any previous subscriptions
  unsubscribersList.forEach(unsub => unsub());
  unsubscribersList = [];

  if (!clientTable) return;

  // Listen to Waiter Calls
  const unsubCalls = dbService.onCallsChange((calls) => {
    if (systemFrozen) return;
    const waiterTypes = ["waiter", "water", "bill"];
    waiterTypes.forEach(type => {
      const lastCallId = localStorage.getItem(`last_call_${type}`);
      if (lastCallId) {
        const matchingCall = calls.find(c => c.id === lastCallId);
        if (matchingCall && matchingCall.status === "accepted") {
          localStorage.removeItem(`last_call_${type}`);

          const acceptedMsgs = {
            fr: "🔔 Votre serveur a accepté votre appel et arrive !",
            en: "🔔 Your waiter accepted your call and is coming!",
            de: "🔔 Ihr Kellner hat Ihren Anruf angenommen und kommt!"
          };
          const msg = acceptedMsgs[currentLang] || acceptedMsgs.fr;
          showToast(msg);
          addNotificationToHistory(msg);
        }
      }
    });
  });
  unsubscribersList.push(unsubCalls);

  // Listen to Pre-orders
  const unsubOrders = dbService.onPreOrdersChange((orders) => {
    if (systemFrozen) return;
    const lastOrderId = localStorage.getItem("last_pre_order_id");
    if (lastOrderId) {
      const matchingOrder = orders.find(o => o.id === lastOrderId);
      if (matchingOrder && matchingOrder.status === "accepted") {
        localStorage.removeItem("last_pre_order_id");

        const acceptedMsgs = {
          fr: "👨‍🍳 Le serveur a validé votre précommande !",
          en: "👨‍🍳 The waiter confirmed your pre-order!",
          de: "👨‍🍳 Der Kellner hat Ihre Vorbestellung bestätigt!"
        };
        const msg = acceptedMsgs[currentLang] || acceptedMsgs.fr;
        showToast(msg);
        addNotificationToHistory(msg);
      }
    }
  });
  unsubscribersList.push(unsubOrders);
}
// ============================================================================
// NOTIFICATION SYSTEM HISTORY & DRAWER (ROLEX THEME IMPLEMENTATION)
// ============================================================================
let memoryNotifications = [];

function addNotificationToHistory(message) {
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  memoryNotifications.push({
    id: Math.random().toString(36).substr(2, 9),
    time: timeStr,
    message: message,
    table: clientTable
  });

  // Keep last 25 alerts to save space
  if (memoryNotifications.length > 25) {
    memoryNotifications.shift();
  }

  // Show green badge dot
  const bellBadge = document.getElementById("bellBadge");
  if (bellBadge) {
    bellBadge.style.display = "block";
  }
}

function renderNotificationHistory() {
  const ndContentFeed = document.getElementById("ndContentFeed");
  if (!ndContentFeed) return;

  const tableNotifications = memoryNotifications.filter(n => n.table === clientTable);

  if (tableNotifications.length === 0) {
    ndContentFeed.innerHTML = `
            <div class="nd-empty-state">
                Aucune notification pour le moment.
            </div>
        `;
    return;
  }

  ndContentFeed.innerHTML = "";
  // Show newest first
  tableNotifications.slice().reverse().forEach(notif => {
    const card = document.createElement("div");
    card.className = "nd-card";

    card.innerHTML = `
            <div class="nd-card-top">
                <span class="nd-card-time">${notif.time}</span>
                <span class="nd-card-status nd-status-accepted">Confirmé</span>
            </div>
            <div class="nd-card-body">
                ${notif.message}
            </div>
        `;
    ndContentFeed.appendChild(card);
  });
}

// ============================================================================
// GREY CORNER — INTELLIGENT GPS GEOFENCING & SECURITY SYSTEM
// ============================================================================
const GeoFenceManager = {
  CENTER_LAT: 34.0344054,
  CENTER_LNG: -5.0154828,
  ALLOWED_RADIUS: 80, // meters

  calculateDistance: function (lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  isWithinGeofence: function (lat, lng) {
    const dist = this.calculateDistance(this.CENTER_LAT, this.CENTER_LNG, lat, lng);
    console.log(`📏 Distance to Grey Corner center: ${dist.toFixed(1)} meters.`);
    return dist <= this.ALLOWED_RADIUS;
  }
};

const LocationSecurityManager = {
  lastCoords: null,
  lastTimestamp: null,

  isMockLocation: function (coords) {
    // 1. Accuracy check (exactly 0 indicates synthetic GPS mock)
    if (coords.accuracy === 0) {
      console.warn("⚠️ GPS Security Warning: Accuracy of exactly 0 is suspicious (Mocked GPS).");
      return true;
    }

    // 2. Velocity anomaly (Teleportation check)
    if (this.lastCoords && this.lastTimestamp) {
      const timeDiff = (Date.now() - this.lastTimestamp) / 1000;
      if (timeDiff > 0) {
        const distanceMoved = GeoFenceManager.calculateDistance(
          this.lastCoords.latitude, this.lastCoords.longitude,
          coords.latitude, coords.longitude
        );
        const speedKmh = (distanceMoved / timeDiff) * 3.6;
        // If they moved > 150m at a speed greater than 300 km/h
        if (distanceMoved > 150 && speedKmh > 300) {
          console.warn(`⚠️ GPS Security Warning: Teleportation detected at ${speedKmh.toFixed(1)} km/h.`);
          return true;
        }
      }
    }

    this.lastCoords = { latitude: coords.latitude, longitude: coords.longitude };
    this.lastTimestamp = Date.now();
    return false;
  }
};

const GPSService = {
  isInside: false,
  isSuspicious: false,
  permissionState: 'prompt', // prompt, granted, denied
  timer: null,

  init: function () {
    console.log("🛰️ Initializing GPSService...");
    this.checkLocation(true);

    // 30 seconds background interval checks
    this.timer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.checkLocation(false);
      }
    }, 30000);
  },

  checkLocation: function (isStartup = false, callback = null) {
    if (!navigator.geolocation) {
      this.handleError("Not compatible");
      if (callback) callback(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = position.coords;
        this.permissionState = 'granted';

        if (LocationSecurityManager.isMockLocation(coords)) {
          this.isSuspicious = true;
          this.isInside = false;
          this.updateUI('suspect');
          if (callback) callback(false);
          return;
        }

        this.isSuspicious = false;
        const inside = GeoFenceManager.isWithinGeofence(coords.latitude, coords.longitude);
        this.isInside = inside;

        if (inside) {
          this.updateUI('inside');
          if (callback) callback(true);
        } else {
          this.updateUI('outside');
          if (callback) callback(false);
        }
      },
      (error) => {
        console.warn("⚠️ GPS Location query failed:", error.message);
        if (error.code === error.PERMISSION_DENIED) {
          this.permissionState = 'denied';
        }
        this.handleError(error.message);
        if (callback) callback(false);
      },
      options
    );
  },

  handleError: function (msg) {
    this.isInside = false;
    if (this.permissionState === 'denied') {
      this.updateUI('denied');
    } else {
      this.updateUI('error');
    }
  },

  updateUI: function (state) {
    const badge = document.getElementById("gpsStatusBadge");
    const text = document.getElementById("gpsStatusText");
    if (!badge || !text) return;

    badge.className = "gps-status-badge";

    const textMap = {
      fr: {
        inside: "Chez Grey Corner Fès",
        outside: "Mode consultation uniquement",
        suspect: "Position GPS suspecte !",
        denied: "Autoriser le GPS pour commander",
        error: "Erreur GPS. Vérifiez vos réglages"
      },
      en: {
        inside: "At Grey Corner Fès",
        outside: "Read-only Menu",
        suspect: "Invalid GPS position !",
        denied: "Allow GPS to interact",
        error: "GPS Error. Check settings"
      },
      de: {
        inside: "Bei Grey Corner Fès",
        outside: "Nur Lese-Menü",
        suspect: "Ungültige GPS-Position !",
        denied: "GPS erlauben zum Bestellen",
        error: "GPS-Fehler. Einstellungen prüfen"
      }
    };

    const currentLangTexts = textMap[currentLang] || textMap.fr;

    if (state === 'inside') {
      badge.classList.add("gps-inside");
      text.textContent = currentLangTexts.inside;
      this.toggleInteractiveControls(true);
    } else if (state === 'outside') {
      badge.classList.add("gps-outside");
      text.textContent = currentLangTexts.outside;
      this.toggleInteractiveControls(false);
    } else if (state === 'suspect') {
      badge.classList.add("gps-suspect");
      text.textContent = currentLangTexts.suspect;
      this.toggleInteractiveControls(false);
    } else if (state === 'denied') {
      badge.classList.add("gps-denied");
      text.textContent = currentLangTexts.denied;
      this.toggleInteractiveControls(false);
    } else {
      badge.classList.add("gps-error");
      text.textContent = currentLangTexts.error;
      this.toggleInteractiveControls(false);
    }
  },

  toggleInteractiveControls: function (enable) {
    const cabCall = document.getElementById("cabCallWaiter");
    const cabWater = document.getElementById("cabRequestWater");
    const cabBill = document.getElementById("cabRequestBill");
    const cdSubmit = document.getElementById("cdSubmitBtn");

    const buttons = [cabCall, cabWater, cabBill, cdSubmit];
    buttons.forEach(btn => {
      if (!btn) return;
      if (enable) {
        btn.classList.remove("disabled-gps");
      } else {
        btn.classList.add("disabled-gps");
      }
    });

    // Ensure the quick action bar is displayed at all times
    const actionBar = document.getElementById("clientActionBar");
    if (actionBar) {
      actionBar.style.display = "block";
    }
  }
};

// --- Wire up HTML Events ---
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Cart
  initClientCart();

  // First initialize Firebase Session, then parse URL / Detect Table to ensure active listener compliance!
  initClientFirebaseSession(() => {
    detectTableNumber();
  });

  // ❄️ System Freeze Listener
  dbService.onSystemFreezeChange((frozen) => {
    systemFrozen = frozen;

    // Target call buttons and pre-order submit button
    const cabCall = document.getElementById("cabCallWaiter");
    const cabWater = document.getElementById("cabRequestWater");
    const cabBill = document.getElementById("cabRequestBill");
    const cdSubmit = document.getElementById("cdSubmitBtn");

    const targets = [cabCall, cabWater, cabBill, cdSubmit];
    targets.forEach(btn => {
      if (!btn) return;
      if (frozen) {
        btn.classList.add("frozen-disabled");
        btn.setAttribute("disabled", "true");
      } else {
        btn.classList.remove("frozen-disabled");
        btn.removeAttribute("disabled");
      }
    });

    if (frozen) {
      const tableModal = document.getElementById("tableModalOverlay");
      if (tableModal) tableModal.style.display = "none";
      const ndOverlay = document.getElementById("notificationDrawerOverlay");
      if (ndOverlay) ndOverlay.classList.remove("active");
    }
  });

  // Initialize GPS Geofencing Service
  GPSService.init();

  // Bottom Bar Call Buttons
  const btnCall = document.getElementById("cabCallWaiter");
  const btnWater = document.getElementById("cabRequestWater");
  const btnBill = document.getElementById("cabRequestBill");
  const btnOpenCart = document.getElementById("cabOpenCart");
  const btnCloseCart = document.getElementById("cdCloseBtn");
  const overlayCart = document.getElementById("cartDrawerOverlay");
  const btnSubmitOrder = document.getElementById("cdSubmitBtn");

  if (btnCall) btnCall.addEventListener("click", () => triggerQuickServiceCall("waiter"));
  if (btnWater) btnWater.addEventListener("click", () => triggerQuickServiceCall("water"));
  if (btnBill) btnBill.addEventListener("click", () => triggerQuickServiceCall("bill"));

  if (btnOpenCart) btnOpenCart.addEventListener("click", openCartDrawer);
  if (btnCloseCart) btnCloseCart.addEventListener("click", closeCartDrawer);
  if (overlayCart) overlayCart.addEventListener("click", closeCartDrawer);

  if (btnSubmitOrder) btnSubmitOrder.addEventListener("click", submitPreOrder);

  // Notification Drawer Events
  const bellBtn = document.getElementById("notificationBellBtn");
  const ndOverlay = document.getElementById("notificationDrawerOverlay");
  const ndCloseBtn = document.getElementById("ndCloseBtn");
  const bellBadge = document.getElementById("bellBadge");

  if (bellBtn) {
    bellBtn.addEventListener("click", () => {
      if (bellBadge) bellBadge.style.display = "none";
      if (ndOverlay) ndOverlay.classList.add("active");
      renderNotificationHistory();
    });
  }

  if (ndCloseBtn) {
    ndCloseBtn.addEventListener("click", () => {
      if (ndOverlay) ndOverlay.classList.remove("active");
    });
  }

  if (ndOverlay) {
    ndOverlay.addEventListener("click", (e) => {
      if (e.target === ndOverlay) {
        ndOverlay.classList.remove("active");
      }
    });
  }

  // Check if there are past notifications to display the unread badge
  const tableNotifications = memoryNotifications.filter(n => n.table === clientTable);
  if (tableNotifications.length > 0 && bellBadge && clientTable) {
    bellBadge.style.display = "block";
  }
});
