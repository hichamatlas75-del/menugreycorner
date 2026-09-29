(() => {
  // js/config/firebase.js
  var firebaseConfig = {
    apiKey: "AIzaSyAoINLpUCCic9Xz9_PnM3al9Iu69q1FQpY",
    authDomain: "grey-corner-restaurant.firebaseapp.com",
    projectId: "grey-corner-restaurant",
    storageBucket: "grey-corner-restaurant.firebasestorage.app",
    messagingSenderId: "251703175568",
    appId: "1:251703175568:web:8d693adc297eb869d12b15",
    measurementId: "G-3HVHB0EELC"
  };
  var isFirebaseActive = false;
  var db = null;
  function hasValidFirebaseKeys() {
    return true;
  }
  if (typeof firebase !== "undefined" && hasValidFirebaseKeys()) {
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      db = firebase.firestore();
      db.enablePersistence().catch((err) => {
        console.warn("\u26A0\uFE0F Persistence disabled:", err.code);
      });
      isFirebaseActive = true;
      console.log("\u{1F525} Firebase Connected");
    } catch (e) {
      console.error("\u274C Firebase Init Error:", e);
      isFirebaseActive = false;
    }
  } else {
    console.log("\u2139\uFE0F Simulation Mode Active");
  }
  var _authReady = false;
  var _authReadyQueue = [];
  function whenAuthReady(fn) {
    if (_authReady) {
      fn();
    } else {
      _authReadyQueue.push(fn);
    }
  }
  if (isFirebaseActive && typeof firebase !== "undefined") {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        _authReady = true;
        console.log("\u{1F513} Auth anonyme OK \u2014 UID:", user.uid);
        _authReadyQueue.forEach((fn) => {
          try {
            fn();
          } catch (e) {
            console.error(e);
          }
        });
        _authReadyQueue = [];
      }
    });
    firebase.auth().signInAnonymously().catch((e) => console.warn("\u26A0\uFE0F signInAnonymously \xE9chou\xE9:", e));
  } else {
    _authReady = true;
  }
  var SIM_CHANNEL = "grey_corner_restaurant_channel";
  var simBroadcast = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(SIM_CHANNEL) : null;
  var DEFAULT_WAITERS = [
    { id: "karim", name: "Karim", email: "karim@greycorner.com", active: true },
    { id: "yassine", name: "Yassine", email: "yassine@greycorner.com", active: true }
  ];
  var DEFAULT_TABLES = {};
  var allTablesList = [
    ...Array.from({ length: 15 }, (_, i) => 101 + i),
    // Salle 101-115
    ...Array.from({ length: 19 }, (_, i) => 201 + i),
    // Loge 201-219
    ...Array.from({ length: 23 }, (_, i) => 301 + i)
    // Terrasse 301-323
  ];
  allTablesList.forEach((num, idx) => {
    DEFAULT_TABLES[num] = {
      tableNumber: num,
      assignedTo: idx % 2 === 0 ? "karim" : "yassine",
      active: true
    };
  });
  function getLocalCollection(name, defaultVal = []) {
    const val = localStorage.getItem(`sim_${name}`);
    if (!val) {
      localStorage.setItem(`sim_${name}`, JSON.stringify(defaultVal));
      return defaultVal;
    }
    try {
      return JSON.parse(val);
    } catch (e) {
      console.error("\u274C JSON Parse Error:", name);
      return defaultVal;
    }
  }
  function setLocalCollection(name, data) {
    localStorage.setItem(`sim_${name}`, JSON.stringify(data));
    if (simBroadcast) {
      simBroadcast.postMessage({ type: "SYNC", collection: name, data });
    }
    if (typeof dbService !== "undefined" && dbService._simListeners) {
      dbService._simListeners.forEach((listener) => {
        try {
          listener(name, data);
        } catch (e) {
          console.error(e);
        }
      });
    }
  }
  if (!isFirebaseActive) {
    getLocalCollection("waiters", DEFAULT_WAITERS);
    getLocalCollection("tables", DEFAULT_TABLES);
    getLocalCollection("calls", []);
    getLocalCollection("pre_orders", []);
  }
  function getTableZoneName(tableNum) {
    const num = parseInt(tableNum, 10);
    if (isNaN(num)) return `Table ${tableNum}`;
    if (num >= 101 && num <= 115) return `Salle (Table ${num})`;
    if (num >= 201 && num <= 219) return `Loge (Table ${num})`;
    if (num >= 301 && num <= 323) return `Terrasse (Table ${num})`;
    return `Table ${num}`;
  }
  function sendFcmToWaiters(type, title, body, tableId, docId) {
  }
  var dbService = {
    isCloud() {
      return isFirebaseActive;
    },
    getWaiters(callback) {
      return this.onWaitersChange(callback);
    },
    getTables(callback) {
      return this.onTablesChange(callback);
    },
    _simListeners: [],
    registerSimListener(cb) {
      this._simListeners.push(cb);
    },
    initSimBroadcastListener() {
      if (simBroadcast) {
        simBroadcast.onmessage = (e) => {
          if (e.data && e.data.type === "SYNC") {
            this._simListeners.forEach((cb) => {
              try {
                cb(e.data.collection, e.data.data);
              } catch (err) {
                console.error(err);
              }
            });
          }
        };
      }
      window.addEventListener("storage", (e) => {
        if (e.key && e.key.startsWith("sim_")) {
          const colName = e.key.replace("sim_", "");
          try {
            const data = JSON.parse(e.newValue || "[]");
            this._simListeners.forEach((cb) => {
              try {
                cb(colName, data);
              } catch (err) {
                console.error(err);
              }
            });
          } catch (err) {
          }
        }
      });
    },
    onWaitersChange(callback) {
      if (isFirebaseActive) {
        return db.collection("waiters").onSnapshot((snapshot) => {
          const waiters = [];
          snapshot.forEach((doc) => waiters.push({ id: doc.id, ...doc.data() }));
          callback(waiters);
        }, (err) => console.error("\u274C Waiters stream error:", err));
      } else {
        callback(getLocalCollection("waiters"));
        this.registerSimListener((col, data) => {
          if (col === "waiters") callback(data);
        });
        return () => {
        };
      }
    },
    onTablesChange(callback) {
      if (isFirebaseActive) {
        return db.collection("tables").onSnapshot((snapshot) => {
          const tables = {};
          snapshot.forEach((doc) => {
            tables[doc.id] = doc.data();
          });
          callback(tables);
        }, (err) => console.error("\u274C Tables stream error:", err));
      } else {
        callback(getLocalCollection("tables"));
        this.registerSimListener((col, data) => {
          if (col === "tables") callback(data);
        });
        return () => {
        };
      }
    },
    assignTable(tableId, waiterId, callback) {
      const data = {
        tableNumber: parseInt(tableId),
        assignedTo: waiterId,
        active: true,
        lastUpdated: isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : (/* @__PURE__ */ new Date()).toISOString()
      };
      if (isFirebaseActive) {
        db.collection("tables").doc(String(tableId)).set(data, { merge: true }).then(() => {
          if (callback) callback(true);
        }).catch((e) => {
          console.error(e);
          if (callback) callback(false);
        });
      } else {
        const tables = getLocalCollection("tables");
        tables[tableId] = data;
        setLocalCollection("tables", tables);
        if (callback) callback(true);
      }
    },
    sendCall(tableId, type, callback) {
      whenAuthReady(() => {
        const execute = (waiterId) => {
          const data = {
            table: parseInt(tableId),
            assignedTo: waiterId || "",
            type,
            status: "pending",
            createdAt: isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : (/* @__PURE__ */ new Date()).toISOString(),
            acceptedAt: null,
            completedAt: null
          };
          if (isFirebaseActive) {
            db.collection("waiters_calls").add(data).then((docRef) => {
              try {
                db.collection("waiter_calls").doc(docRef.id).set({
                  ...data,
                  id: docRef.id
                }).catch(() => {
                });
              } catch (e) {
                console.warn("Mirroring call to waiter_calls failed:", e);
              }
              if (callback) callback(true, docRef.id);
            }).catch((e) => {
              console.error(e);
              if (callback) callback(false);
            });
          } else {
            const calls = getLocalCollection("calls");
            const id = "call_" + Math.random().toString(36).substring(2, 9);
            calls.push({ id, ...data });
            setLocalCollection("calls", calls);
            if (callback) callback(true, id);
          }
        };
        if (isFirebaseActive) {
          db.collection("tables").doc(String(tableId)).get().then((doc) => {
            execute(doc.exists ? doc.data().assignedTo : "");
          }).catch(() => execute(""));
        } else {
          const tables = getLocalCollection("tables");
          execute(tables[tableId] ? tables[tableId].assignedTo : "");
        }
      });
    },
    onCallsChange(callback) {
      if (isFirebaseActive) {
        const activeCallsMap = /* @__PURE__ */ new Map();
        const emit = () => {
          const calls = Array.from(activeCallsMap.values());
          calls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          callback(calls);
        };
        const unsubWaiters = db.collection("waiters_calls").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
          snapshot.forEach((doc) => {
            const data = doc.data();
            activeCallsMap.set(doc.id, {
              id: doc.id,
              ...data,
              createdAt: data.createdAt ? typeof data.createdAt.toDate === "function" ? data.createdAt.toDate().toISOString() : data.createdAt : (/* @__PURE__ */ new Date()).toISOString()
            });
          });
          emit();
        }, (err) => console.error("\u274C Calls stream error (waiters_calls):", err));
        const unsubNative = db.collection("waiter_calls").onSnapshot((snapshot) => {
          let hasChange = false;
          snapshot.forEach((doc) => {
            const data = doc.data();
            const existing = activeCallsMap.get(doc.id);
            if (existing && existing.status !== data.status) {
              existing.status = data.status;
              if (data.assignedTo) existing.assignedTo = data.assignedTo;
              hasChange = true;
              db.collection("waiters_calls").doc(doc.id).update({
                status: data.status,
                assignedTo: data.assignedTo || existing.assignedTo || ""
              }).catch(() => {
              });
            }
          });
          if (hasChange) emit();
        }, () => {
        });
        return () => {
          unsubWaiters();
          unsubNative();
        };
      } else {
        const trigger = () => {
          const calls = getLocalCollection("calls");
          calls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          callback(calls);
        };
        trigger();
        this.registerSimListener((col) => {
          if (col === "calls") trigger();
        });
        return () => {
        };
      }
    },
    updateCallStatus(callId, status, waiterId, callback) {
      if (typeof waiterId === "function") {
        callback = waiterId;
        waiterId = null;
      }
      const updateData = {
        status,
        acceptedAt: status === "accepted" ? isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : (/* @__PURE__ */ new Date()).toISOString() : null,
        completedAt: status === "completed" ? isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : (/* @__PURE__ */ new Date()).toISOString() : null
      };
      if (waiterId) updateData.assignedTo = waiterId;
      if (isFirebaseActive) {
        db.collection("waiters_calls").doc(callId).update(updateData).then(() => {
          try {
            db.collection("waiter_calls").doc(callId).update(updateData).catch(() => {
            });
          } catch (e) {
          }
          if (callback) callback(true);
        }).catch((e) => {
          console.error(e);
          if (callback) callback(false);
        });
      } else {
        const calls = getLocalCollection("calls");
        const idx = calls.findIndex((c) => c.id === callId);
        if (idx !== -1) {
          calls[idx] = { ...calls[idx], ...updateData };
          setLocalCollection("calls", calls);
          if (callback) callback(true);
        } else {
          if (callback) callback(false);
        }
      }
    },
    sendPreOrder(tableId, items, note, totalPrice, callback) {
      whenAuthReady(() => {
        const execute = (waiterId) => {
          const data = {
            table: parseInt(tableId),
            assignedTo: waiterId || "",
            items,
            note: note || "",
            totalPrice: parseFloat(totalPrice),
            status: "pending",
            createdAt: isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : (/* @__PURE__ */ new Date()).toISOString(),
            acceptedAt: null
          };
          if (isFirebaseActive) {
            db.collection("pre_orders").add(data).then((docRef) => {
              const zoneName = getTableZoneName(tableId);
              sendFcmToWaiters("PRE_ORDER", `\u{1F468}\u200D\u{1F373} Nouvelle Pr\xE9commande : ${zoneName}`, `Total : ${totalPrice} MAD`, tableId, docRef.id);
              if (callback) callback(true, docRef.id);
            }).catch((e) => {
              console.error(e);
              if (callback) callback(false);
            });
          } else {
            const orders = getLocalCollection("pre_orders");
            const id = "order_" + Math.random().toString(36).substring(2, 9);
            orders.push({ id, ...data });
            setLocalCollection("pre_orders", orders);
            if (callback) callback(true, id);
          }
        };
        if (isFirebaseActive) {
          db.collection("tables").doc(String(tableId)).get().then((doc) => {
            execute(doc.exists ? doc.data().assignedTo : "");
          }).catch(() => execute(""));
        } else {
          const tables = getLocalCollection("tables");
          execute(tables[tableId] ? tables[tableId].assignedTo : "");
        }
      });
    },
    onPreOrdersChange(callback) {
      if (isFirebaseActive) {
        return db.collection("pre_orders").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
          const orders = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            orders.push({
              id: doc.id,
              ...data,
              createdAt: data.createdAt ? typeof data.createdAt.toDate === "function" ? data.createdAt.toDate().toISOString() : data.createdAt : (/* @__PURE__ */ new Date()).toISOString()
            });
          });
          callback(orders);
        }, (err) => console.error("\u274C PreOrders stream error:", err));
      } else {
        const trigger = () => {
          const orders = getLocalCollection("pre_orders");
          orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          callback(orders);
        };
        trigger();
        this.registerSimListener((col) => {
          if (col === "pre_orders") trigger();
        });
        return () => {
        };
      }
    },
    updatePreOrderStatus(orderId, status, waiterId, callback) {
      if (typeof waiterId === "function") {
        callback = waiterId;
        waiterId = null;
      }
      const updateData = {
        status,
        acceptedAt: status === "accepted" ? isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : (/* @__PURE__ */ new Date()).toISOString() : null
      };
      if (waiterId) updateData.assignedTo = waiterId;
      if (isFirebaseActive) {
        db.collection("pre_orders").doc(orderId).update(updateData).then(() => {
          if (callback) callback(true);
        }).catch((e) => {
          console.error(e);
          if (callback) callback(false);
        });
      } else {
        const orders = getLocalCollection("pre_orders");
        const idx = orders.findIndex((o) => o.id === orderId);
        if (idx !== -1) {
          orders[idx] = { ...orders[idx], ...updateData };
          setLocalCollection("pre_orders", orders);
          if (callback) callback(true);
        } else {
          if (callback) callback(false);
        }
      }
    },
    onSystemFreezeChange(callback) {
      if (isFirebaseActive) {
        return db.collection("system").doc("config").onSnapshot((doc) => {
          const frozen = doc.exists && doc.data() && doc.data().frozen === true;
          callback(frozen);
        }, (err) => console.error("\u274C SystemFreeze stream error:", err));
      } else {
        const trigger = () => {
          const config = getLocalCollection("system_config", { frozen: false });
          callback(config.frozen === true);
        };
        trigger();
        this.registerSimListener((col) => {
          if (col === "system_config") trigger();
        });
        return () => {
        };
      }
    },
    setSystemFreeze(frozen, callback) {
      if (isFirebaseActive) {
        db.collection("system").doc("config").set({
          frozen,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }).then(() => {
          if (callback) callback(true);
        }).catch((e) => {
          console.error("\u274C Freeze Error:", e);
          if (callback) callback(false, e.message || String(e));
        });
      } else {
        setLocalCollection("system_config", { frozen, updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
        if (callback) callback(true);
      }
    },
    cleanupOldData(callback) {
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1e3);
      if (isFirebaseActive) {
        db.collection("waiters_calls").where("createdAt", "<", cutoff).get().then((snapshot) => {
          const batch = db.batch();
          snapshot.forEach((doc) => batch.delete(doc.ref));
          return batch.commit();
        }).then(() => db.collection("waiter_calls").where("createdAt", "<", cutoff).get()).then((snapshot) => {
          const batch = db.batch();
          snapshot.forEach((doc) => batch.delete(doc.ref));
          return batch.commit();
        }).then(() => db.collection("pre_orders").where("createdAt", "<", cutoff).get()).then((snapshot) => {
          const batch = db.batch();
          snapshot.forEach((doc) => batch.delete(doc.ref));
          return batch.commit();
        }).then(() => {
          if (callback) callback(true);
        }).catch((e) => {
          console.error(e);
          if (callback) callback(false);
        });
      } else {
        const calls = getLocalCollection("calls").filter((c) => new Date(c.createdAt) >= cutoff);
        setLocalCollection("calls", calls);
        const orders = getLocalCollection("pre_orders").filter((o) => new Date(o.createdAt) >= cutoff);
        setLocalCollection("pre_orders", orders);
        if (callback) callback(true);
      }
    }
  };
  if (!isFirebaseActive) {
    dbService.initSimBroadcastListener();
  }
  window.isFirebaseActive = isFirebaseActive;
  window.db = db;
  window.whenAuthReady = whenAuthReady;
  window.dbService = dbService;
  window.getTableZoneName = getTableZoneName;

  // js/data/menu-data.js
  var menuData = [
    {
      "category": {
        "fr": "PETIT D\xC9JEUNER",
        "en": "BREAKFAST",
        "de": "FR\xDCHST\xDCCK",
        "ar": "\u0641\u0637\u0648\u0631 \u0627\u0644\u0635\u0628\u0627\u062D"
      },
      "id": "petit-dejeuner",
      "items": [
        {
          "name": {
            "fr": "BRUNCH DUO",
            "en": "BRUNCH DUO",
            "de": "BRUNCH DUO",
            "ar": "\u0628\u0631\u0627\u0646\u0634 \u062F\u0648\u064A\u0648 (\u0644\u0634\u062E\u0635\u064A\u0646)"
          },
          "description": {
            "fr": "Poulet pan\xE9, croquettes, croque-maison, omelette au fromage, charcuterie, fromage, pain seigle, beldi (2 mlaoui, 2 harcha), mesclun salade, muffin, gaufre, 2 jus d'orange, 2 boissons chaudes au choix, 2 desserts et 2 eaux min\xE9rales.",
            "en": "Breaded chicken, croquettes, homemade croque, cheese omelette, cold cuts, cheese, rye bread, beldi (2 mlaoui, 2 harcha), mesclun salad, muffin, waffle, 2 orange juices, 2 hot drinks of choice, 2 desserts, and 2 mineral waters.",
            "de": "Paniertes H\xE4hnchen, Kroketten, hausgemachtes Croque, K\xE4seomelett, Aufschnitt, K\xE4se, Roggenbrot, Beldi (2 Mlaoui, 2 Harcha), Mesclun-Salat, Muffin, Waffel, 2 Orangens\xE4fte, 2 Hei\xDFgetr\xE4nke nach Wahl, 2 Desserts und 2 Mineralwasser.",
            "ar": "\u062F\u062C\u0627\u062C \u0645\u0642\u0631\u0645\u0634\u060C \u0643\u0631\u0648\u0643\u064A\u062A\u060C \u0643\u0631\u0648\u0643 \u0645\u0646\u0632\u0644\u064A\u060C \u0623\u0648\u0645\u0644\u064A\u062A \u0628\u0627\u0644\u062C\u0628\u0646\u060C \u0634\u0627\u0631\u0643\u0648\u062A\u0631\u064A\u060C \u062C\u0628\u0646\u060C \u062E\u0628\u0632 \u0627\u0644\u0634\u0648\u0641\u0627\u0646\u060C \u0641\u0637\u0648\u0631 \u0628\u0644\u062F\u064A (2 \u0645\u0644\u0627\u0648\u064A\u060C 2 \u062D\u0631\u0634\u0629)\u060C \u0633\u0644\u0637\u0629 \u0645\u064A\u0633\u0643\u0644\u0627\u0646\u060C \u0645\u0627\u0641\u0646\u060C \u0648\u0627\u0641\u0644\u060C 2 \u0639\u0635\u064A\u0631 \u0628\u0631\u062A\u0642\u0627\u0644\u060C 2 \u0645\u0634\u0631\u0648\u0628 \u0633\u0627\u062E\u0646 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643\u060C 2 \u062A\u062D\u0644\u064A\u0629 \u06482 \u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A."
          },
          "price": "144",
          "image": "images/petit-dej-duo.webp"
        },
        {
          "name": {
            "fr": "BRUNCH GREYCORNER",
            "en": "GREYCORNER BRUNCH",
            "de": "GREYCORNER BRUNCH",
            "ar": "\u0628\u0631\u0627\u0646\u0634 \u063A\u0631\u064A \u0643\u0648\u0631\u0646\u0631 \u0627\u0644\u0645\u0645\u064A\u0632"
          },
          "description": {
            "fr": "Saucisses, omelette, fromage, toast hollandais, croquettes fromage, charcuteries, pain seigle, mesclun salade, gaufre, pancake, jus d'orange, boisson chaude au choix, dessert et eau min\xE9rale.",
            "en": "Sausages, omelette, cheese, Dutch toast, cheese croquettes, cold cuts, rye bread, mesclun salad, waffle, pancake, orange juice, hot drink of choice, dessert, and mineral water.",
            "de": "W\xFCrstchen, Omelett, K\xE4se, holl\xE4ndischer Toast, K\xE4sekroketten, Aufschnitt, Roggenbrot, Mesclun-Salat, Waffel, Pfannkuchen, Orangensaft, Hei\xDFgetr\xE4nk nach Wahl, Dessert und Mineralwasser.",
            "ar": "\u0646\u0642\u0627\u0646\u0642\u060C \u0623\u0648\u0645\u0644\u064A\u062A\u060C \u062C\u0628\u0646\u060C \u062A\u0648\u0633\u062A \u0647\u0648\u0644\u0646\u062F\u064A\u060C \u0643\u0631\u0648\u0643\u064A\u062A \u062C\u0628\u0646\u060C \u0634\u0627\u0631\u0643\u0648\u062A\u0631\u064A\u060C \u062E\u0628\u0632 \u0627\u0644\u0634\u0648\u0641\u0627\u0646\u060C \u0633\u0644\u0637\u0629 \u0645\u064A\u0633\u0643\u0644\u0627\u0646\u060C \u0648\u0627\u0641\u0644\u060C \u0628\u0627\u0646\u0643\u064A\u0643\u060C \u0639\u0635\u064A\u0631 \u0628\u0631\u062A\u0642\u0627\u0644\u060C \u0645\u0634\u0631\u0648\u0628 \u0633\u0627\u062E\u0646 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643\u060C \u062A\u062D\u0644\u064A\u0629 \u0648\u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A."
          },
          "price": "85",
          "image": "images/petit-dej-gc.webp"
        },
        {
          "name": {
            "fr": "AMERICAIN",
            "en": "AMERICAN",
            "de": "Amerikanisch",
            "ar": "\u0641\u0637\u0648\u0631 \u0623\u0645\u0631\u064A\u0643\u064A"
          },
          "description": {
            "fr": "Bacon, avocat, 2oeufs, fromage, pain c\xE9r\xE9ales, jus d'orange, boisson chaude au choix, dessert et eau min\xE9rale.",
            "en": "Bacon, avocado, 2eggs, cheese, cereal bread, orange juice, hot drink of choice, dessert, and mineral water.",
            "de": "Bacon, Avocado, 2 Eier,  K\xE4se, Getreidebrot, Orangensaft, Hei\xDFgetr\xE4nk nach Wahl, Dessert und Mineralwasser.",
            "ar": "\u0628\u064A\u0643\u0648\u0646\u060C \u0623\u0641\u0648\u0643\u0627\u062F\u0648\u060C \u0628\u064A\u0636\u062A\u0627\u0646\u060C \u062C\u0628\u0646\u060C \u062E\u0628\u0632 \u0627\u0644\u062D\u0628\u0648\u0628 \u0627\u0644\u0643\u0627\u0645\u0644\u0629\u060C \u0639\u0635\u064A\u0631 \u0628\u0631\u062A\u0642\u0627\u0644\u060C \u0645\u0634\u0631\u0648\u0628 \u0633\u0627\u062E\u0646 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643\u060C \u062A\u062D\u0644\u064A\u0629 \u0648\u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A."
          },
          "price": "68",
          "image": "images/petit-dej-americain.webp",
          "isNew": true
        },
        {
          "name": {
            "fr": "NORV\xC9GIEN",
            "en": "NORWEGIAN",
            "de": "NORWEGISCH",
            "ar": "\u0641\u0637\u0648\u0631 \u0646\u0631\u0648\u064A\u062C\u064A \u0628\u0627\u0644\u0633\u0644\u0645\u0648\u0646"
          },
          "description": {
            "fr": "Saumon, avocat, fromage, pain c\xE9r\xE9ales, jus d'orange, boisson chaude au choix, dessert et eau min\xE9rale.",
            "en": "Salmon, avocado, cheese, cereal bread, orange juice, hot drink of choice, dessert, and mineral water.",
            "de": "Lachs, Avocado, K\xE4se, Getreidebrot, Orangensaft, Hei\xDFgetr\xE4nk nach Wahl, Dessert und Mineralwasser.",
            "ar": "\u0633\u0644\u0645\u0648\u0646 \u0645\u062F\u062E\u0646\u060C \u0623\u0641\u0648\u0643\u0627\u062F\u0648\u060C \u062C\u0628\u0646\u060C \u062E\u0628\u0632 \u0627\u0644\u062D\u0628\u0648\u0628 \u0627\u0644\u0643\u0627\u0645\u0644\u0629\u060C \u0639\u0635\u064A\u0631 \u0628\u0631\u062A\u0642\u0627\u0644\u060C \u0645\u0634\u0631\u0648\u0628 \u0633\u0627\u062E\u0646 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643\u060C \u062A\u062D\u0644\u064A\u0629 \u0648\u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A."
          },
          "price": "68",
          "image": "images/petit-dej-norvegien.webp"
        },
        {
          "name": {
            "fr": "ESPAGNOL",
            "en": "SPANISH",
            "de": "SPANISCH",
            "ar": "\u0641\u0637\u0648\u0631 \u0625\u0633\u0628\u0627\u0646\u064A"
          },
          "description": {
            "fr": "Tortilla, croquettes, tapenade, thon, tomates fraiche, fromage, pain seigle et mesclun salade, jus d'orange, boisson chaude au choix, dessert et eau min\xE9rale.",
            "en": "Tortilla, croquettes, tapenade, tuna, fresh tomatoes, cheese, rye bread, mesclun salad, orange juice, hot drink of choice, dessert, and mineral water.",
            "de": "Tortilla, Kroketten, Tapenade, Thunfisch, frische Tomaten, K\xE4se, Roggenbrot, Mesclun-Salat, Orangensaft, Hei\xDFgetr\xE4nk nach Wahl, Dessert und Mineralwasser.",
            "ar": "\u062A\u0648\u0631\u062A\u064A\u0644\u0627 \u0625\u0633\u0628\u0627\u0646\u064A\u0629\u060C \u0643\u0631\u0648\u0643\u064A\u062A\u060C \u062A\u0627\u0628\u064A\u0646\u0627\u062F\u060C \u062A\u0648\u0646\u0629\u060C \u0637\u0645\u0627\u0637\u0645 \u0637\u0627\u0632\u062C\u0629\u060C \u062C\u0628\u0646\u060C \u062E\u0628\u0632 \u0627\u0644\u0634\u0648\u0641\u0627\u0646 \u0648\u0633\u0644\u0637\u0629 \u0645\u064A\u0633\u0643\u0644\u0627\u0646\u060C \u0639\u0635\u064A\u0631 \u0628\u0631\u062A\u0642\u0627\u0644\u060C \u0645\u0634\u0631\u0648\u0628 \u0633\u0627\u062E\u0646 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643\u060C \u062A\u062D\u0644\u064A\u0629 \u0648\u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A."
          },
          "price": "64",
          "image": "images/petit-dej-espagnol.webp"
        },
        {
          "name": {
            "fr": "MQUILA MERGUEZ",
            "en": "MQUILA Merguez sausage ",
            "de": "MQUILA Merguez-Wurst",
            "ar": "\u0645\u0642\u064A\u0644\u0629 \u0628\u0627\u0644\u0645\u0631\u0642\u0627\u0632 \u0648\u0627\u0644\u0628\u064A\u0636 \u0627\u0644\u0628\u0644\u062F\u064A"
          },
          "description": {
            "fr": "Merguez, poivrons, oignons, tomates cerises, deux \u0153ufs, jus d'orange, boisson chaude au choix, dessert et eau min\xE9rale.",
            "en": "Merguez, peppers, onions, cherry tomatoes, two eggs, orange juice, hot drink of choice, dessert, and mineral water.",
            "de": "Merguez, Paprika, Zwiebeln, Kirschtomaten, zwei Eier, Orangensaft, Hei\xDFgetr\xE4nk nach Wahl, Dessert und Mineralwasser.",
            "ar": "\u0645\u0631\u0642\u0627\u0632\u060C \u0641\u0644\u0641\u0644 \u062D\u0644\u0648\u060C \u0628\u0635\u0644\u060C \u0637\u0645\u0627\u0637\u0645 \u0643\u0631\u0632\u064A\u0629\u060C \u0628\u064A\u0636\u062A\u0627\u0646\u060C \u0639\u0635\u064A\u0631 \u0628\u0631\u062A\u0642\u0627\u0644\u060C \u0645\u0634\u0631\u0648\u0628 \u0633\u0627\u062E\u0646 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643\u060C \u062A\u062D\u0644\u064A\u0629 \u0648\u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A."
          },
          "price": "64",
          "image": "images/petit-dej-mquila.webp"
        },
        {
          "name": {
            "fr": "OMELETTE DU CHEF",
            "en": "CHEF'S OMELETTE",
            "de": "OMELETT DES CHEFKOCHS",
            "ar": "\u0623\u0648\u0645\u0644\u064A\u062A \u0627\u0644\u0634\u064A\u0641"
          },
          "description": {
            "fr": "Omelette 3 \u0153ufs, champignons, \xE9pinards, fromage, mesclun salade, jus d'orange, boisson chaude au choix, dessert et eau min\xE9rale (suppl\xE9ment \u0153ufs beldi 05 DH).",
            "en": "3-egg omelette, mushrooms, spinach, cheese, mesclun salad, orange juice, hot drink of choice, dessert, and mineral water (add free-range eggs 05 DH).",
            "de": "3-Eier-Omelett, Pilze, Spinat, K\xE4se, Mesclun-Salat, Orangensaft, Hei\xDFgetr\xE4nk nach Wahl, Dessert und Mineralwasser (Zusatz Freilandeier 05 DH).",
            "ar": "\u0623\u0648\u0645\u0644\u064A\u062A 3 \u0628\u064A\u0636\u0627\u062A\u060C \u0641\u0637\u0631\u060C \u0633\u0628\u0627\u0646\u062E\u060C \u062C\u0628\u0646\u060C \u0633\u0644\u0637\u0629 \u0645\u064A\u0633\u0643\u0644\u0627\u0646\u060C \u0639\u0635\u064A\u0631 \u0628\u0631\u062A\u0642\u0627\u0644\u060C \u0645\u0634\u0631\u0648\u0628 \u0633\u0627\u062E\u0646 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643\u060C \u062A\u062D\u0644\u064A\u0629 \u0648\u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A (\u0625\u0636\u0627\u0641\u0629 \u0628\u064A\u0636 \u0628\u0644\u062F\u064A 5 \u062F\u0631\u0627\u0647\u0645)."
          },
          "price": "58",
          "image": "images/petit-dej-chef.webp"
        },
        {
          "name": {
            "fr": "HOLLANDAIS",
            "en": "DUTCH",
            "de": "HOLL\xC4NDISCH",
            "ar": "\u0641\u0637\u0648\u0631 \u0647\u0648\u0644\u0646\u062F\u064A"
          },
          "description": {
            "fr": "Pain de mie complet avec deux \u0153ufs au plat, fromage, dinde fum\xE9e, mesclun salade, jus d'orange, boisson chaude au choix, dessert et eau min\xE9rale.",
            "en": "Wholemeal sandwich bread with two fried eggs, cheese, smoked turkey, mesclun salad, orange juice, hot drink of choice, dessert, and mineral water.",
            "de": "Vollkorn-Toastbrot mit zwei Spiegeleiern, K\xE4se, ger\xE4ucherter Pute, Mesclun-Salat, Orangensaft, Hei\xDFgetr\xE4nk nach Wahl, Dessert und Mineralwasser.",
            "ar": "\u062A\u0648\u0633\u062A \u0642\u0645\u062D \u0643\u0627\u0645\u0644 \u0645\u0639 \u0628\u064A\u0636\u062A\u064A\u0646 \u0645\u0642\u0644\u064A\u062A\u064A\u0646\u060C \u062C\u0628\u0646\u060C \u062F\u064A\u0643 \u0631\u0648\u0645\u064A \u0645\u062F\u062E\u0646\u060C \u0633\u0644\u0637\u0629 \u0645\u064A\u0633\u0643\u0644\u0627\u0646\u060C \u0639\u0635\u064A\u0631 \u0628\u0631\u062A\u0642\u0627\u0644\u060C \u0645\u0634\u0631\u0648\u0628 \u0633\u0627\u062E\u0646 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643\u060C \u062A\u062D\u0644\u064A\u0629 \u0648\u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A."
          },
          "price": "52",
          "image": "images/petit-dej-hollandais.webp"
        },
        {
          "name": {
            "fr": "OMELETTE VEGETARIENNE",
            "en": "VEGETARIAN OMELETTE",
            "de": "VEGETARISCHES OMELETT",
            "ar": "\u0623\u0648\u0645\u0644\u064A\u062A \u0628\u0627\u0644\u062E\u0636\u0627\u0631"
          },
          "description": {
            "fr": "Omelette 3 \u0153ufs, l\xE9gumes, mesclun salade, jus d'orange, boisson chaude au choix, dessert et eau min\xE9rale (suppl\xE9ment \u0153ufs beldi 05 DH).",
            "en": "3-egg omelette, vegetables, mesclun salad, orange juice, hot drink of choice, dessert, and mineral water (add free-range eggs 05 DH).",
            "de": "3-Eier-Omelett, Gem\xFCse, Mesclun-Salat, Orangensaft, Hei\xDFgetr\xE4nk nach Wahl, Dessert und Mineralwasser (Zusatz Freilandeier 05 DH).",
            "ar": "\u0623\u0648\u0645\u0644\u064A\u062A 3 \u0628\u064A\u0636\u0627\u062A\u060C \u062E\u0636\u0627\u0631 \u0645\u0634\u0643\u0644\u0629\u060C \u0633\u0644\u0637\u0629 \u0645\u064A\u0633\u0643\u0644\u0627\u0646\u060C \u0639\u0635\u064A\u0631 \u0628\u0631\u062A\u0642\u0627\u0644\u060C \u0645\u0634\u0631\u0648\u0628 \u0633\u0627\u062E\u0646 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643\u060C \u062A\u062D\u0644\u064A\u0629 \u0648\u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A (\u0625\u0636\u0627\u0641\u0629 \u0628\u064A\u0636 \u0628\u0644\u062F\u064A 5 \u062F\u0631\u0627\u0647\u0645)."
          },
          "price": "52",
          "image": "images/petit-dej-veg.webp"
        },
        {
          "name": {
            "fr": "BERB\xC8RE",
            "en": "BERBER",
            "de": "BERBER",
            "ar": "\u0641\u0637\u0648\u0631 \u0623\u0645\u0627\u0632\u064A\u063A\u064A \u062A\u0642\u0644\u064A\u062F\u064A"
          },
          "description": {
            "fr": "Baghrir, amlou, fruits secs, jben, miel, banane, jus d'orange, boisson chaude au choix, dessert et eau min\xE9rale.",
            "en": "Baghrir, amlou, dried fruits, jben (fresh cheese), honey, banana, orange juice, hot drink of choice, dessert, and mineral water.",
            "de": "Baghrir, Amlou, Trockenfr\xFCchte, Jben (Frischk\xE4se), Honig, Banane, Orangensaft, Hei\xDFgetr\xE4nk nach Wahl, Dessert und Mineralwasser.",
            "ar": "\u0628\u063A\u0631\u064A\u0631\u060C \u0623\u0645\u0644\u0648 \u0628\u0627\u0644\u0644\u0648\u0632\u060C \u0641\u0648\u0627\u0643\u0647 \u062C\u0627\u0641\u0629\u060C \u062C\u0628\u0646 \u0628\u0644\u062F\u064A\u060C \u0639\u0633\u0644 \u062D\u0631\u060C \u0645\u0648\u0632\u060C \u0639\u0635\u064A\u0631 \u0628\u0631\u062A\u0642\u0627\u0644\u060C \u0645\u0634\u0631\u0648\u0628 \u0633\u0627\u062E\u0646 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643\u060C \u062A\u062D\u0644\u064A\u0629 \u0648\u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A."
          },
          "price": "54",
          "image": "images/petit-dej-berbere.webp"
        },
        {
          "name": {
            "fr": "COMPAGNAD",
            "en": "COPAGNARD",
            "de": "COMPAGNAR",
            "ar": "\u0641\u0637\u0648\u0631 \u0642\u0631\u0648\u064A (\u0643\u0648\u0645\u0628\u0627\u0646\u064A\u0627\u0631)"
          },
          "description": {
            "fr": "3 \u0152uf brouill\xE9 ,3 charcuterie, 2 pain cake chocolat ,pain seigle, huile d\u2019olive , olive , mesclun salade, jus d'orange, boisson chaude au choix, dessert et eau min\xE9rale.",
            "en": "3 scrambled eggs, 3 cold cuts, 2 slices of chocolate cake, rye bread, olive oil, olive , mesclun salad, orange juice, hot drink of your choice, dessert, and mineral water.",
            "de": "3 R\xFChreier, 3 Sorten Aufschnitt, 2 St\xFCcke Schokoladenkuchen, Roggenbrot, Oliven\xF6l, schwarze Oliven , Mesclun-Salat, Orangensaft, Hei\xDFgetr\xE4nk nach Wahl, Dessert und Mineralwasser.",
            "ar": "3 \u0628\u064A\u0636\u0627\u062A \u0645\u062E\u0641\u0648\u0642\u0629\u060C 3 \u0623\u0646\u0648\u0627\u0639 \u0634\u0627\u0631\u0643\u0648\u062A\u0631\u064A\u060C 2 \u0628\u0627\u0646 \u0643\u064A\u0643 \u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629\u060C \u062E\u0628\u0632 \u0627\u0644\u0634\u0648\u0641\u0627\u0646\u060C \u0632\u064A\u062A \u0632\u064A\u062A\u0648\u0646\u060C \u0632\u064A\u062A\u0648\u0646\u060C \u0633\u0644\u0637\u0629 \u0645\u064A\u0633\u0643\u0644\u0627\u0646\u060C \u0639\u0635\u064A\u0631 \u0628\u0631\u062A\u0642\u0627\u0644\u060C \u0645\u0634\u0631\u0648\u0628 \u0633\u0627\u062E\u0646 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643\u060C \u062A\u062D\u0644\u064A\u0629 \u0648\u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A."
          },
          "price": "52",
          "image": "images/petit-dej-compagnard.webp",
          "isNew": true
        },
        {
          "name": {
            "fr": "FASSI",
            "en": "FASSI",
            "de": "FASSI",
            "ar": "\u0641\u0637\u0648\u0631 \u0641\u0627\u0633\u064A \u0623\u0635\u064A\u0644"
          },
          "description": {
            "fr": "Khli3, trois \u0153ufs au plat, jus d'orange, boisson chaude au choix, dessert et eau min\xE9rale (suppl\xE9ment \u0153ufs beldi 5 DH).",
            "en": "Khli3 (dried meat), three fried eggs, orange juice, hot drink of choice, dessert, and mineral water (add free-range eggs 5 DH).",
            "de": "Khli3 (Trockenfleisch), drei Spiegeleier, Orangensaft, Hei\xDFgetr\xE4nk nach Wahl, Dessert und Mineralwasser (Zusatz Freilandeier 5 DH).",
            "ar": "\u062E\u0644\u064A\u0639 \u0641\u0627\u0633\u064A\u060C 3 \u0628\u064A\u0636\u0627\u062A \u0645\u0642\u0644\u064A\u0629\u060C \u0639\u0635\u064A\u0631 \u0628\u0631\u062A\u0642\u0627\u0644\u060C \u0645\u0634\u0631\u0648\u0628 \u0633\u0627\u062E\u0646 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643\u060C \u062A\u062D\u0644\u064A\u0629 \u0648\u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A (\u0625\u0636\u0627\u0641\u0629 \u0628\u064A\u0636 \u0628\u0644\u062F\u064A 5 \u062F\u0631\u0627\u0647\u0645)."
          },
          "price": "55",
          "image": "images/petit-dej-fassi.webp"
        },
        {
          "name": {
            "fr": "OMELETTE CONTINENTAL",
            "en": "CONTINENTAL OMELETTE",
            "de": "CONTINENTALES OMELETT",
            "ar": "\u0623\u0648\u0645\u0644\u064A\u062A \u0643\u0648\u0646\u062A\u064A\u0646\u0646\u062A\u0627\u0644"
          },
          "description": {
            "fr": "Omelette 3 \u0153ufs, charcuterie, fromage, mesclun salade, jus d'orange, boisson chaude au choix, dessert et eau min\xE9rale (suppl\xE9ment \u0153ufs beldi 5 DH).",
            "en": "3-egg omelette, cold cuts, cheese, mesclun salad, orange juice, hot drink of choice, dessert, and mineral water (add free-range eggs 5 DH).",
            "de": "3-Eier-Omelett, Aufschnitt, K\xE4se, Mesclun-Salat, Orangensaft, Hei\xDFgetr\xE4nk nach Wahl, Dessert und Mineralwasser (Zusatz Freilandeier 5 DH).",
            "ar": "\u0623\u0648\u0645\u0644\u064A\u062A 3 \u0628\u064A\u0636\u0627\u062A\u060C \u0634\u0627\u0631\u0643\u0648\u062A\u0631\u064A\u060C \u062C\u0628\u0646\u060C \u0633\u0644\u0637\u0629 \u0645\u064A\u0633\u0643\u0644\u0627\u0646\u060C \u0639\u0635\u064A\u0631 \u0628\u0631\u062A\u0642\u0627\u0644\u060C \u0645\u0634\u0631\u0648\u0628 \u0633\u0627\u062E\u0646 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643\u060C \u062A\u062D\u0644\u064A\u0629 \u0648\u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A (\u0625\u0636\u0627\u0641\u0629 \u0628\u064A\u0636 \u0628\u0644\u062F\u064A 5 \u062F\u0631\u0627\u0647\u0645)."
          },
          "price": "52",
          "image": "images/petit-dej-cont.webp"
        },
        {
          "name": {
            "fr": "OMELETTE FROMAGE",
            "en": "CHEESE OMELETTE",
            "de": "K\xC4SE-OMELETT",
            "ar": "\u0623\u0648\u0645\u0644\u064A\u062A \u0628\u0627\u0644\u062C\u0628\u0646"
          },
          "description": {
            "fr": "Omelette 3 \u0153ufs, fromage, mesclun salade, jus d'orange, boisson chaude au choix, dessert et eau min\xE9rale",
            "en": "3-egg omelette, cheese, mixed greens salad, orange juice, choice of hot beverage, dessert, and mineral water",
            "de": "3-Ei-Omelett, K\xE4se, gemischter Salat, Orangensaft, Hei\xDFgetr\xE4nk nach Wahl, Dessert und Mineralwasser",
            "ar": "\u0623\u0648\u0645\u0644\u064A\u062A 3 \u0628\u064A\u0636\u0627\u062A\u060C \u062C\u0628\u0646\u060C \u0633\u0644\u0637\u0629 \u0645\u064A\u0633\u0643\u0644\u0627\u0646\u060C \u0639\u0635\u064A\u0631 \u0628\u0631\u062A\u0642\u0627\u0644\u060C \u0645\u0634\u0631\u0648\u0628 \u0633\u0627\u062E\u0646 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643\u060C \u062A\u062D\u0644\u064A\u0629 \u0648\u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A."
          },
          "price": "52",
          "image": "images/omelette-fromage.webp"
        },
        {
          "name": {
            "fr": "BELDI",
            "en": "BELDI",
            "de": "BELDI",
            "ar": "\u0641\u0637\u0648\u0631 \u0628\u0644\u062F\u064A \u0645\u063A\u0631\u0628\u064A"
          },
          "description": {
            "fr": "Deux mlaoui, deux harcha, un baghrir, jben, huile d\u2019olive, miel, olives noires, jus d'orange, boisson chaude au choix, dessert et eau min\xE9rale.",
            "en": "Two mlaoui, two harcha, one baghrir, jben (fresh cheese), olive oil, honey, black olives, orange juice, hot drink of choice, dessert, and mineral water.",
            "de": "Zwei Mlaoui, zwei Harcha, ein Baghrir, Jben (Frischk\xE4se), Oliven\xF6l, Honig, schwarze Oliven, Orangensaft, Hei\xDFgetr\xE4nk nach Wahl, Dessert und Mineralwasser.",
            "ar": "\u0627\u062B\u0646\u0627\u0646 \u0645\u0644\u0627\u0648\u064A\u060C \u0627\u062B\u0646\u0627\u0646 \u062D\u0631\u0634\u0629\u060C \u0628\u063A\u0631\u064A\u0631\u060C \u062C\u0628\u0646 \u0628\u0644\u062F\u064A\u060C \u0632\u064A\u062A \u0632\u064A\u062A\u0648\u0646\u060C \u0639\u0633\u0644 \u062D\u0631\u060C \u0632\u064A\u062A\u0648\u0646 \u0623\u0633\u0648\u062F\u060C \u0639\u0635\u064A\u0631 \u0628\u0631\u062A\u0642\u0627\u0644\u060C \u0645\u0634\u0631\u0648\u0628 \u0633\u0627\u062E\u0646 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643\u060C \u062A\u062D\u0644\u064A\u0629 \u0648\u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A."
          },
          "price": "45",
          "image": "images/petit-dej-beldi.webp"
        },
        {
          "name": {
            "fr": "OMELETTE NATURE",
            "en": "PLAIN OMELETTE",
            "de": "NATUR-OMELETT",
            "ar": "\u0623\u0648\u0645\u0644\u064A\u062A \u0633\u0627\u062F\u0629"
          },
          "description": {
            "fr": "Omelette 3 \u0153ufs, mesclun salade, jus d'orange, boisson chaude au choix, dessert et eau min\xE9rale",
            "en": "3-egg omelette, mixed greens salad, orange juice, choice of hot beverage, dessert, and mineral water",
            "de": "3-Ei-Omelett, gemischter Salat, Orangensaft, Hei\xDFgetr\xE4nk nach Wahl, Dessert und Mineralwasser",
            "ar": "\u0623\u0648\u0645\u0644\u064A\u062A 3 \u0628\u064A\u0636\u0627\u062A \u0633\u0627\u062F\u0629\u060C \u0633\u0644\u0637\u0629 \u0645\u064A\u0633\u0643\u0644\u0627\u0646\u060C \u0639\u0635\u064A\u0631 \u0628\u0631\u062A\u0642\u0627\u0644\u060C \u0645\u0634\u0631\u0648\u0628 \u0633\u0627\u062E\u0646 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643\u060C \u062A\u062D\u0644\u064A\u0629 \u0648\u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A."
          },
          "price": "42",
          "image": "images/omelette-nature.webp"
        },
        {
          "name": {
            "fr": "LIGHT",
            "en": "LIGHT",
            "de": "LEICHT",
            "ar": "\u0641\u0637\u0648\u0631 \u0644\u0627\u064A\u062A \u062E\u0641\u064A\u0641 \u0648\u0635\u062D\u064A"
          },
          "description": {
            "fr": "Pain complet grill\xE9, jben, huile d\u2019olive, amlou, olives noires, jus d'orange, boisson chaude au choix, dessert et eau min\xE9rale.",
            "en": "Toasted wholemeal bread, jben (fresh cheese), olive oil, amlou (nut spread), black olives, orange juice, hot drink of choice, dessert, and mineral water.",
            "de": "Getoastetes Vollkornbrot, Jben (Frischk\xE4se), Oliven\xF6l, Amlou (Nussaufstrich), schwarze Oliven, Orangensaft, Hei\xDFgetr\xE4nk nach Wahl, Dessert und Mineralwasser.",
            "ar": "\u062E\u0628\u0632 \u0643\u0627\u0645\u0644 \u0645\u062D\u0645\u0635\u060C \u062C\u0628\u0646 \u0628\u0644\u062F\u064A\u060C \u0632\u064A\u062A \u0632\u064A\u062A\u0648\u0646\u060C \u0623\u0645\u0644\u0648 \u0628\u0627\u0644\u0644\u0648\u0632\u060C \u0632\u064A\u062A\u0648\u0646 \u0623\u0633\u0648\u062F\u060C \u0639\u0635\u064A\u0631 \u0628\u0631\u062A\u0642\u0627\u0644\u060C \u0645\u0634\u0631\u0648\u0628 \u0633\u0627\u062E\u0646 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643\u060C \u062A\u062D\u0644\u064A\u0629 \u0648\u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A."
          },
          "price": "42",
          "image": "images/petit-dej-light.webp"
        },
        {
          "name": {
            "fr": "EXPRESS",
            "en": "EXPRESS",
            "de": "EXPRESS",
            "ar": "\u0641\u0637\u0648\u0631 \u0625\u0643\u0633\u0628\u0631\u064A\u0633"
          },
          "description": {
            "fr": "Panier de quatre viennoiseries, jus d'orange, boisson chaude au choix, dessert et eau min\xE9rale.",
            "en": "Basket of four pastries, orange juice, hot drink of choice, dessert, and mineral water.",
            "de": "Korb mit vier Geb\xE4ckst\xFCcken, Orangensaft, Hei\xDFgetr\xE4nk nach Wahl, Dessert und Mineralwasser.",
            "ar": "\u0633\u0644\u0629 \u0645\u0646 \u0623\u0631\u0628\u0639 \u0642\u0637\u0639 \u0645\u0639\u062C\u0646\u0627\u062A \u0641\u0631\u0646\u0633\u064A\u0629\u060C \u0639\u0635\u064A\u0631 \u0628\u0631\u062A\u0642\u0627\u0644\u060C \u0645\u0634\u0631\u0648\u0628 \u0633\u0627\u062E\u0646 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643\u060C \u062A\u062D\u0644\u064A\u0629 \u0648\u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A."
          },
          "price": "44",
          "image": "images/petit-dej-express.webp"
        },
        {
          "name": {
            "fr": "MENU ENFANT",
            "en": "KIDS MENU",
            "de": "KINDERMEN\xDC",
            "ar": "\u0641\u0637\u0648\u0631 \u0627\u0644\u0623\u0637\u0641\u0627\u0644"
          },
          "description": {
            "fr": "Toast au fromage, ou Cr\xEApe Nutella, ou gaufre, ou pancake, corn flakes, Lait au chocolat.",
            "en": "Cheese toast, or Nutella cr\xEApe, or waffle, or pancake, corn flakes, chocolate milk.",
            "de": "K\xE4setoast, oder Nutella Cr\xEApe, oder Waffel, oder Pfannkuchen, Cornflakes, Schokomilch.",
            "ar": "\u062A\u0648\u0633\u062A \u0628\u0627\u0644\u062C\u0628\u0646\u060C \u0623\u0648 \u0643\u0631\u064A\u0628 \u0646\u0648\u062A\u064A\u0644\u0627\u060C \u0623\u0648 \u0648\u0627\u0641\u0644\u060C \u0623\u0648 \u0628\u0627\u0646\u0643\u064A\u0643\u060C \u0643\u0648\u0631\u0646 \u0641\u0644\u064A\u0643\u0633\u060C \u0648\u062D\u0644\u064A\u0628 \u0628\u0627\u0644\u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629."
          },
          "price": "40",
          "image": "images/menu-enfant-pdj.webp"
        }
      ]
    },
    {
      "category": {
        "fr": "ENTR\xC9ES FROIDES",
        "en": "COLD STARTERS",
        "de": "KALTE VORSPEISEN",
        "ar": "\u0627\u0644\u0645\u0642\u0628\u0644\u0627\u062A \u0627\u0644\u0628\u0627\u0631\u062F\u0629"
      },
      "id": "entrees",
      "items": [
        {
          "name": {
            "fr": "TERRE MER",
            "en": "SURF & TURF",
            "de": "SURF & TURF",
            "ar": "\u0633\u0644\u0637\u0629 \u0623\u0631\u0636 \u0648\u0628\u062D\u0631 (\u062A\u064A\u0631 \u0625\u064A \u0645\u064A\u0631)"
          },
          "description": {
            "fr": "Calamar, gambas, poulet pan\xE9, laitue, ma\xEFs, tomate cerise, sauce du chef.",
            "en": "Calamari, shrimp, breaded chicken, lettuce, corn, cherry tomato, chef's sauce.",
            "de": "Tintenfisch, Garnelen, paniertes H\xE4hnchen, Salat, Mais, Kirschtomate, So\xDFe des Chefkochs.",
            "ar": "\u0643\u0644\u0645\u0627\u0631\u060C \u062C\u0645\u0628\u0631\u064A (\u0642\u064A\u0645\u0631\u0648\u0646)\u060C \u062F\u062C\u0627\u062C \u0645\u0642\u0631\u0645\u0634\u060C \u062E\u0633\u060C \u0630\u0631\u0629\u060C \u0637\u0645\u0627\u0637\u0645 \u0643\u0631\u0632\u064A\u0629\u060C \u0648\u0635\u0644\u0635\u0629 \u0627\u0644\u0634\u064A\u0641 \u0627\u0644\u062E\u0627\u0635\u0629."
          },
          "price": "78",
          "image": "images/entree-terremer.webp"
        },
        {
          "name": {
            "fr": "QUINOA",
            "en": "QUINOA",
            "de": "QUINOA",
            "ar": "\u0633\u0644\u0637\u0629 \u0627\u0644\u0643\u064A\u0646\u0648\u0627 \u0627\u0644\u0635\u062D\u064A\u0629"
          },
          "description": {
            "fr": "Quinoa vari\xE9, gambas, brunoise, pomme, kiwi, mangue, ananas, menthe, sauce miel, motard.",
            "en": "Assorted quinoa, shrimp, brunoise, apple, kiwi, mango, pineapple, mint, honey mustard sauce.",
            "de": "Verschiedener Quinoa, Garnelen, Brunoise, Apfel, Kiwi, Mango, Ananas, Minze, Honig-Senf-So\xDFe.",
            "ar": "\u0643\u064A\u0646\u0648\u0627 \u0645\u0634\u0643\u0644\u0629\u060C \u062C\u0645\u0628\u0631\u064A\u060C \u0628\u0631\u0648\u0646\u0648\u0627\u0632 \u062E\u0636\u0627\u0631\u060C \u062A\u0641\u0627\u062D\u060C \u0643\u064A\u0648\u064A\u060C \u0645\u0627\u0646\u062C\u0648\u060C \u0623\u0646\u0627\u0646\u0627\u0633\u060C \u0646\u0639\u0646\u0627\u0639\u060C \u0648\u0635\u0644\u0635\u0629 \u0627\u0644\u0639\u0633\u0644 \u0648\u0627\u0644\u062E\u0631\u062F\u0644."
          },
          "price": "68",
          "image": "images/entree-quinoa.webp"
        },
        {
          "name": {
            "fr": "CESAR",
            "en": "CAESAR",
            "de": "CAESAR",
            "ar": "\u0633\u0644\u0637\u0629 \u0633\u064A\u0632\u0631 \u0628\u0627\u0644\u062F\u062C\u0627\u062C \u0627\u0644\u0645\u0634\u0648\u064A"
          },
          "description": {
            "fr": "Boudin de poulet, parmesan, tomate cerise, crouton, laitue romaine, sauce c\xE9sar.",
            "en": "Chicken sausage, parmesan, cherry tomato, crouton, romaine lettuce, Caesar sauce.",
            "de": "H\xE4hnchenwurst, Parmesan, Kirschtomate, Crouton, R\xF6mersalat, Caesar-So\xDFe.",
            "ar": "\u0631\u0648\u0644 \u062F\u062C\u0627\u062C\u060C \u062C\u0628\u0646\u0629 \u0628\u0627\u0631\u0645\u064A\u0632\u0627\u0646\u060C \u0637\u0645\u0627\u0637\u0645 \u0643\u0631\u0632\u064A\u0629\u060C \u0642\u0637\u0639 \u062E\u0628\u0632 \u0645\u062D\u0645\u0635 (\u0643\u0631\u0648\u062A\u0648\u0646)\u060C \u062E\u0633 \u0631\u0648\u0645\u0627\u0646\u064A\u060C \u0648\u0635\u0644\u0635\u0629 \u0633\u064A\u0632\u0631 \u0627\u0644\u063A\u0646\u064A\u0629."
          },
          "price": "65",
          "image": "images/entree-caesar.webp"
        }
      ]
    },
    {
      "category": {
        "fr": "ENTR\xC9ES CHAUDES",
        "en": "HOT STARTERS",
        "de": "WARME VORSPEISEN",
        "ar": "\u0627\u0644\u0645\u0642\u0628\u0644\u0627\u062A \u0627\u0644\u0633\u0627\u062E\u0646\u0629"
      },
      "id": "entrees-chaudes",
      "items": [
        {
          "name": {
            "fr": "CROUSTILLON GAMBAS",
            "en": "SHRIMP CRUSTILLON",
            "de": "GARNELEN-CROUSTILLON",
            "ar": "\u0643\u0631\u0648\u0633\u062A\u064A\u0648\u0646 \u0627\u0644\u062C\u0645\u0628\u0631\u064A \u0627\u0644\u0645\u0642\u0631\u0645\u0634"
          },
          "description": {
            "fr": "Pur\xE9e de pomme de terre, gambas pan\xE9es au s\xE9same blanc.",
            "en": "Mashed potatoes, shrimp breaded with white sesame.",
            "de": "Kartoffelp\xFCree, Garnelen paniert mit wei\xDFem Sesam.",
            "ar": "\u0628\u0637\u0627\u0637\u0633 \u0645\u0647\u0631\u0648\u0633\u0629 (\u0628\u0648\u0631\u064A\u0647)\u060C \u062C\u0645\u0628\u0631\u064A \u0628\u0627\u0646\u064A\u0647 \u0645\u0642\u0631\u0645\u0634 \u0628\u0627\u0644\u0633\u0645\u0633\u0645 \u0627\u0644\u0623\u0628\u064A\u0636."
          },
          "price": "68",
          "image": "images/entree-croustillon.webp"
        },
        {
          "name": {
            "fr": "PIL PIL ESPAGNOL",
            "en": "SPANISH PIL PIL",
            "de": "SPANISCHES PIL PIL",
            "ar": "\u062C\u0645\u0628\u0631\u064A \u0628\u064A\u0644 \u0628\u064A\u0644 \u0625\u0633\u0628\u0627\u0646\u064A"
          },
          "description": {
            "fr": "Gambas, huile d'olive, piment fort, ciboulette, tomate cerise.",
            "en": "Shrimp, olive oil, hot pepper, chives, cherry tomato.",
            "de": "Garnelen, Oliven\xF6l, scharfe Paprika, Schnittlauch, Kirschtomate.",
            "ar": "\u062C\u0645\u0628\u0631\u064A\u060C \u0632\u064A\u062A \u0632\u064A\u062A\u0648\u0646 \u0628\u0643\u0631\u060C \u0641\u0644\u0641\u0644 \u062D\u0627\u0631\u060C \u062B\u0648\u0645 \u0642\u0635\u0628\u064A (\u0633\u064A\u0628\u0648\u0644\u064A\u062A)\u060C \u0648\u0637\u0645\u0627\u0637\u0645 \u0643\u0631\u0632\u064A\u0629."
          },
          "price": "68",
          "image": "images/entree-pilpil.webp"
        },
        {
          "name": {
            "fr": "BOULETTES DE POULET FROMAGE",
            "en": "Chicken meatball with cheese",
            "de": "H\xE4hnchenfleischb\xE4llchen mit K\xE4se",
            "ar": "\u0643\u0631\u0627\u062A \u0627\u0644\u062F\u062C\u0627\u062C \u0627\u0644\u0645\u0642\u0631\u0645\u0634\u0629 \u0628\u0627\u0644\u062C\u0628\u0646"
          },
          "description": {
            "fr": "4 Blanc de poulet hach\xE9, cheddar.",
            "en": "4 Minced chicken breast, cheddar",
            "de": "4 Gehackte H\xE4hnchenbrust, Cheddar.",
            "ar": "4 \u0643\u0631\u0627\u062A \u0645\u0646 \u0635\u062F\u0631 \u0627\u0644\u062F\u062C\u0627\u062C \u0627\u0644\u0645\u0641\u0631\u0648\u0645 \u0645\u0639 \u062C\u0628\u0646\u0629 \u0627\u0644\u0634\u064A\u062F\u0631 \u0627\u0644\u0630\u0627\u0626\u0628\u0629."
          },
          "price": "52",
          "image": "images/entree-boulette-poulet.webp",
          "isNew": true
        }
      ]
    },
    {
      "category": {
        "fr": "PLATS",
        "en": "MAIN COURSES",
        "de": "HAUPTGERICHTE",
        "ar": "\u0627\u0644\u0623\u0637\u0628\u0627\u0642 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629"
      },
      "id": "plats",
      "items": [
        {
          "name": {
            "fr": "PAV\xC9 DE SAUMON \xC0 LA PLANCHA ",
            "en": "Grilled salmon fillet",
            "de": "Lachssteak vom Grill",
            "ar": "\u0634\u0631\u064A\u062D\u0629 \u0633\u0644\u0645\u0648\u0646 \u0639\u0644\u0649 \u0627\u0644\u0628\u0644\u0627\u0646\u0634\u0627"
          },
          "description": {
            "fr": "Pav\xE9 de saumon saisi, sauce vierge maison aux petits l\xE9gumes croquants et herbes fra\xEEches  ",
            "en": "Seared salmon fillet, homemade \u201Csauce vierge\u201D with crunchy vegetables and fresh herbs.",
            "de": "Kurz gebratenes Lachssteak, hausgemachte Vierge-Sauce mit knackigem Gem\xFCse und frischen Kr\xE4utern.",
            "ar": "\u0642\u0637\u0639\u0629 \u0633\u0644\u0645\u0648\u0646 \u0645\u0634\u0648\u064A\u0629 \u0639\u0644\u0649 \u0627\u0644\u0628\u0644\u0627\u0646\u0634\u0627\u060C \u0635\u0644\u0635\u0629 \u0641\u064A\u0631\u062C \u0645\u062A\u0628\u0644\u0629 \u0628\u0627\u0644\u062E\u0636\u0627\u0631 \u0627\u0644\u0645\u0642\u0631\u0645\u0634\u0629 \u0648\u0627\u0644\u0623\u0639\u0634\u0627\u0628 \u0627\u0644\u0637\u0627\u0632\u062C\u0629."
          },
          "price": "145",
          "image": "images/plat-saumon.webp"
        },
        {
          "name": {
            "fr": "FILET DE B\u0152UF AUX HERBES DE L'ATLAS ",
            "en": "Beef fillet with Atlas herbs",
            "de": "Rinderfilet mit Atlas-Kr\xE4utern",
            "ar": "\u0641\u064A\u0644\u064A\u0647 \u0644\u062D\u0645 \u0628\u0642\u0631\u064A \u0628\u0623\u0639\u0634\u0627\u0628 \u0627\u0644\u0623\u0637\u0644\u0633"
          },
          "description": {
            "fr": "C\u0153ur de filet de b\u0153uf saisi, infus\xE9 aux herbes aromatiques de l'Atlas",
            "en": "Seared beef tenderloin heart, infused with aromatic Atlas herbs.",
            "de": "Kurz gebratenes Rinderfiletherz, mit aromatischen Atlas-Kr\xE4utern verfeinert",
            "ar": "\u0642\u0644\u0628 \u0641\u064A\u0644\u064A\u0647 \u0644\u062D\u0645 \u0628\u0642\u0631\u064A \u0637\u0631\u064A \u0645\u0634\u0648\u064A\u060C \u0645\u0646\u0643\u0647 \u0628\u0627\u0644\u0623\u0639\u0634\u0627\u0628 \u0627\u0644\u0639\u0637\u0631\u064A\u0629 \u0645\u0646 \u062C\u0628\u0627\u0644 \u0627\u0644\u0623\u0637\u0644\u0633."
          },
          "price": "135",
          "image": "images/plat-filet.webp"
        },
        {
          "name": {
            "fr": "LE FILET DE B\u0152UF \xC9MINC\xC9 ",
            "en": "Sliced beef fillet",
            "de": "Geschnittenes Rinderfilet",
            "ar": "\u0634\u0631\u0627\u0626\u062D \u0641\u064A\u0644\u064A\u0647 \u0644\u062D\u0645 \u0628\u0642\u0631\u064A (\u0625\u064A\u0645\u064A\u0646\u0633\u064A)"
          },
          "description": {
            "fr": "C\u0153ur de filet de b\u0153uf, champignons de Paris frais, cr\xE8me onctueuse, fines herbes",
            "en": "Beef tenderloin heart, fresh button mushrooms, creamy sauce, fine herbs",
            "de": "Rinderfiletherz, frische Champignons, cremige Sauce, feine Kr\xE4uter.",
            "ar": "\u0642\u0644\u0628 \u0641\u064A\u0644\u064A\u0647 \u0644\u062D\u0645 \u0628\u0642\u0631\u064A\u060C \u0641\u0637\u0631 \u0628\u0627\u0631\u064A\u0633 \u0637\u0627\u0632\u062C\u060C \u0643\u0631\u064A\u0645\u0629 \u0646\u0627\u0639\u0645\u0629 \u063A\u0646\u064A\u0629\u060C \u0648\u0623\u0639\u0634\u0627\u0628 \u0645\u0646\u0633\u0645\u0629."
          },
          "price": "115",
          "image": "images/plat-eminceboeuf.webp"
        },
        {
          "name": {
            "fr": "ESCALOPE A LA MILANAISE",
            "en": "MILANESE ESCALOPE",
            "de": "MAIL\xC4NDER SCHNITZEL",
            "ar": "\u0625\u0633\u0643\u0627\u0644\u0648\u0628 \u062F\u062C\u0627\u062C \u0645\u064A\u0644\u0627\u0646\u064A\u0632"
          },
          "description": {
            "fr": "Escalope de poulet pan\xE9e dor\xE9e, sauce velout\xE9e aux champignons frais.",
            "en": "Golden breaded chicken escalope, creamy sauce with fresh mushrooms",
            "de": "Goldbraune panierte H\xE4hnchenschnitzel, samtige Sauce mit frischen Champignons",
            "ar": "\u0625\u0633\u0643\u0627\u0644\u0648\u0628 \u062F\u062C\u0627\u062C \u0645\u0642\u0631\u0645\u0634 \u0630\u0647\u0628\u064A\u060C \u064A\u0642\u062F\u0645 \u0645\u0639 \u0635\u0644\u0635\u0629 \u0627\u0644\u0641\u0637\u0631 \u0627\u0644\u0637\u0627\u0632\u062C \u0627\u0644\u0645\u062E\u0645\u0644\u064A\u0629."
          },
          "price": "85",
          "image": "images/plat-milanaise.webp"
        },
        {
          "name": {
            "fr": "BROCHETTES DE POULET MARIN\xC9ES  ",
            "en": "Marinated chicken skewers",
            "de": "Marinierte H\xE4hnchenspie\xDFe",
            "ar": "\u0623\u0633\u064A\u0627\u062E \u062F\u062C\u0627\u062C \u0645\u062A\u0628\u0644\u0629 \u0648\u0645\u0634\u0648\u064A\u0629"
          },
          "description": {
            "fr": "Blanc de poulet s\xE9lectionn\xE9, marinade aromatique grill\xE9 sur broche, sauce barbecue",
            "en": "Selected chicken breast, aromatic marinade, grilled on skewers, barbecue sauce",
            "de": "Ausgew\xE4hlte H\xE4hnchenbrust, aromatische Marinade, gegrillt auf Spie\xDFen, Barbecue-Sauce",
            "ar": "\u0635\u062F\u0631 \u062F\u062C\u0627\u062C \u0645\u0646\u062A\u0642\u0649 \u0648\u0645\u062A\u0628\u0644 \u0628\u0627\u0644\u0623\u0639\u0634\u0627\u0628 \u0627\u0644\u0639\u0637\u0631\u064A\u0629 \u0648\u0645\u0634\u0648\u064A \u0639\u0644\u0649 \u0627\u0644\u0633\u064A\u062E\u060C \u064A\u0642\u062F\u0645 \u0645\u0639 \u0635\u0644\u0635\u0629 \u0627\u0644\u0628\u0627\u0631\u0628\u064A\u0643\u064A\u0648."
          },
          "price": "84",
          "image": "images/plat-brochette.webp"
        },
        {
          "name": {
            "fr": "\xC9MINC\xC9 DE POULET \xC0 LA CR\xC8ME DE CHAMPIGNONS ",
            "en": "Sliced chicken in creamy mushroom sauce",
            "de": "H\xE4hnchengeschnetzeltes in cremiger Champignonsauce",
            "ar": "\u0634\u0631\u0627\u0626\u062D \u062F\u062C\u0627\u062C \u0628\u0643\u0631\u064A\u0645\u0629 \u0627\u0644\u0641\u0637\u0631"
          },
          "description": {
            "fr": "Morceaux de poulet saisis, sauce onctueuse aux champignons de Paris frais",
            "en": "Seared chicken pieces, creamy sauce with fresh button mushrooms",
            "de": "Kurz gebratene H\xE4hnchenteile, samtige Sauce mit frischen Champignons.",
            "ar": "\u0642\u0637\u0639 \u062F\u062C\u0627\u062C \u0637\u0631\u064A\u0629 \u0645\u062D\u0645\u0631\u0629\u060C \u0645\u0639 \u0635\u0644\u0635\u0629 \u0643\u0631\u064A\u0645\u064A\u0629 \u063A\u0646\u064A\u0629 \u0628\u0641\u0637\u0631 \u0628\u0627\u0631\u064A\u0633 \u0627\u0644\u0637\u0627\u0632\u062C."
          },
          "price": "88",
          "image": "images/plat-emincepoulet.webp"
        },
        {
          "name": {
            "fr": "MENU ENFANT",
            "en": "KIDS MENU",
            "de": "KINDERMEN\xDC",
            "ar": "\u0648\u062C\u0628\u0629 \u0623\u0637\u0641\u0627\u0644 \u0631\u0626\u064A\u0633\u064A\u0629"
          },
          "description": {
            "fr": "Pasta nature ou Mini pizza avec boisson au choix OU Burger ou nuggets + frite avec boisson au choix.",
            "en": "Plain pasta or Mini pizza with drink of choice OR Burger or nuggets + fries with drink of choice.",
            "de": "Natur-Pasta oder Mini-Pizza mit Getr\xE4nk nach Wahl ODER Burger oder Nuggets + Pommes mit Getr\xE4nk nach Wahl.",
            "ar": "\u0628\u0627\u0633\u062A\u0627 \u0633\u0627\u062F\u0629 \u0623\u0648 \u0645\u064A\u0646\u064A \u0628\u064A\u062A\u0632\u0627 \u0645\u0639 \u0645\u0634\u0631\u0648\u0628 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643\u060C \u0623\u0648 \u0628\u0631\u062C\u0631 / \u0646\u0627\u063A\u062A\u0633 \u0648\u0628\u0637\u0627\u0637\u0633 \u0645\u0642\u0644\u064A\u0629 \u0645\u0639 \u0645\u0634\u0631\u0648\u0628 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643."
          },
          "price": "58",
          "image": "images/menu-enfant-plat.webp"
        },
        {
          "name": {
            "fr": "ACCOMPAGNEMENTS",
            "en": "SIDE DISHES",
            "de": "BEILAGEN",
            "ar": "\u0627\u0644\u0645\u0631\u0627\u0641\u0642\u0627\u062A (\u0645\u0631\u0641\u0642\u0629 \u0645\u0639 \u0627\u0644\u0623\u0637\u0628\u0627\u0642)"
          },
          "description": {
            "fr": "2 Accompagnements au choix : L\xE9gumes saut\xE9s, riz, frites, pur\xE9e pomme de terre, potatos.",
            "en": "2 Side dishes of choice: Saut\xE9ed vegetables, rice, french fries, mashed potatoes, potato wedges.",
            "de": "2 Beilagen nach Wahl: Gebratenes Gem\xFCse, Reis, Pommes Frites, Kartoffelp\xFCree, Kartoffelspalten.",
            "ar": "\u0645\u0631\u0627\u0641\u0642\u0627\u0646 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643: \u062E\u0636\u0627\u0631 \u0633\u0648\u062A\u064A\u0647\u060C \u0623\u0631\u0632\u060C \u0628\u0637\u0627\u0637\u0633 \u0645\u0642\u0644\u064A\u0629\u060C \u0628\u0637\u0627\u0637\u0633 \u0645\u0647\u0631\u0648\u0633\u0629 (\u0628\u0648\u0631\u064A\u0647)\u060C \u0623\u0648 \u0628\u0637\u0627\u0637\u0633 \u0628\u0648\u062A\u0627\u062A\u0648\u0633."
          },
          "price": "Inclus",
          "image": "images/accompagnements.webp"
        }
      ]
    },
    {
      "category": {
        "fr": "COUSCOUS VENDREDI",
        "en": "FRIDAY COUSCOUS",
        "de": "FREITAGS COUSCOUS",
        "ar": "\u0643\u0633\u0643\u0633 \u0627\u0644\u062C\u0645\u0639\u0629"
      },
      "items": [
        {
          "name": {
            "fr": "Couscous viande avec petit lait",
            "en": "Meat couscous with buttermilk",
            "de": "Fleisch-Couscous mit Buttermilch",
            "ar": "\u0643\u0633\u0643\u0633 \u0645\u063A\u0631\u0628\u064A \u0628\u0627\u0644\u0644\u062D\u0645 \u0645\u0639 \u0627\u0644\u0644\u0628\u0646 (\u0633\u064A\u0643\u0648\u0643)"
          },
          "description": {
            "fr": "Plat traditionnel servi le vendredi.",
            "en": "Traditional dish served on Fridays.",
            "de": "Traditionelles Gericht, das freitags serviert wird.",
            "ar": "\u0643\u0633\u0643\u0633 \u0645\u063A\u0631\u0628\u064A \u062A\u0642\u0644\u064A\u062F\u064A \u0641\u0627\u062E\u0631 \u0628\u0627\u0644\u0644\u062D\u0645 \u0648\u0627\u0644\u062E\u0636\u0627\u0631 \u0627\u0644\u0633\u0628\u0639\u0629\u060C \u064A\u0642\u062F\u0645 \u0645\u0639 \u0627\u0644\u0644\u0628\u0646 \u0627\u0644\u0631\u0627\u0626\u0628 \u0643\u0644 \u064A\u0648\u0645 \u062C\u0645\u0639\u0629."
          },
          "price": "64",
          "image": "images/Couscous-poulet.webp"
        },
        {
          "name": {
            "fr": "Couscous poulet avec petit lait",
            "en": "Chicken couscous with buttermilk",
            "de": "H\xE4hnchen-Couscous mit Buttermilch",
            "ar": "\u0643\u0633\u0643\u0633 \u0645\u063A\u0631\u0628\u064A \u0628\u0627\u0644\u062F\u062C\u0627\u062C \u0645\u0639 \u0627\u0644\u0644\u0628\u0646 (\u0633\u064A\u0643\u0648\u0643)"
          },
          "description": {
            "fr": "Plat traditionnel servi le vendredi.",
            "en": "Traditional dish served on Fridays.",
            "de": "Traditionelles Gericht, das freitags serviert wird.",
            "ar": "\u0643\u0633\u0643\u0633 \u0645\u063A\u0631\u0628\u064A \u062A\u0642\u0644\u064A\u062F\u064A \u0641\u0627\u062E\u0631 \u0628\u0627\u0644\u062F\u062C\u0627\u062C \u0648\u0627\u0644\u062E\u0636\u0627\u0631 \u0627\u0644\u0633\u0628\u0639\u0629\u060C \u064A\u0642\u062F\u0645 \u0645\u0639 \u0627\u0644\u0644\u0628\u0646 \u0627\u0644\u0631\u0627\u0626\u0628 \u0643\u0644 \u064A\u0648\u0645 \u062C\u0645\u0639\u0629."
          },
          "price": "54",
          "image": "images/Couscous-poulet.webp"
        }
      ]
    },
    {
      "category": {
        "fr": "SANDWICHS CIABATTA",
        "en": "CIABATTA SANDWICHES",
        "de": "CIABATTA SANDWICHES",
        "ar": "\u0633\u0646\u062F\u0648\u064A\u062A\u0634\u0627\u062A \u062A\u0634\u0627\u0628\u0627\u062A\u0627"
      },
      "id": "sandwichs",
      "items": [
        {
          "name": {
            "fr": "SANDWICH CHEESE STEAK",
            "en": "CHEESE STEAK SANDWICH",
            "de": "CHEESE STEAK SANDWICH",
            "ar": "\u0633\u0627\u0646\u062F\u0648\u064A\u062A\u0634 \u062A\u0634\u064A\u0632 \u0633\u062A\u064A\u0643 \u062A\u0634\u0627\u0628\u0627\u062A\u0627"
          },
          "description": {
            "fr": "Steak grill\xE9 tendre, cheddar.",
            "en": "Tender grilled steak, cheddar.",
            "de": "Zartes gegrilltes Steak, Cheddar.",
            "ar": "\u0634\u0631\u064A\u062D\u0629 \u0633\u062A\u064A\u0643 \u0628\u0642\u0631\u064A \u0637\u0631\u064A\u0629 \u0645\u0634\u0648\u064A\u0629\u060C \u0648\u062C\u0628\u0646\u0629 \u0634\u064A\u062F\u0631 \u0630\u0627\u0626\u0628\u0629 \u0641\u064A \u062E\u0628\u0632 \u062A\u0634\u0627\u0628\u0627\u062A\u0627 \u0627\u0644\u0625\u064A\u0637\u0627\u0644\u064A."
          },
          "price": "65",
          "image": "images/sand-cheesesteak.webp"
        },
        {
          "name": {
            "fr": "FRUITS DE MER",
            "en": "SEAFOOD",
            "de": "MEERESFR\xDCCHTE",
            "ar": "\u0633\u0627\u0646\u062F\u0648\u064A\u062A\u0634 \u0641\u0648\u0627\u0643\u0647 \u0627\u0644\u0628\u062D\u0631 \u062A\u0634\u0627\u0628\u0627\u062A\u0627"
          },
          "description": {
            "fr": "Crevette, Calamar, sauce du chef.",
            "en": "Shrimp, Calamari, chef's sauce.",
            "de": "Garnele, Tintenfisch, So\xDFe des Chefkochs.",
            "ar": "\u062C\u0645\u0628\u0631\u064A\u060C \u0643\u0644\u0645\u0627\u0631 \u0637\u0631\u064A\u060C \u0648\u0635\u0644\u0635\u0629 \u0627\u0644\u0634\u064A\u0641 \u0627\u0644\u062E\u0627\u0635\u0629 \u0641\u064A \u062E\u0628\u0632 \u062A\u0634\u0627\u0628\u0627\u062A\u0627."
          },
          "price": "65",
          "image": "images/sand-fruitsmer.webp"
        },
        {
          "name": {
            "fr": "POULARD",
            "en": "Sliced chicken with mushroom",
            "de": "H\xFChnerstreifen-Sandwich mit Champignons",
            "ar": "\u0633\u0627\u0646\u062F\u0648\u064A\u062A\u0634 \u062F\u062C\u0627\u062C \u0628\u0648\u0644\u0627\u0631\u062F"
          },
          "description": {
            "fr": "Eminc\xE9 de Poulet, cheddar, champignon, sauce blanche",
            "en": "Sliced chicken, cheddar, mushroom, white sauce.",
            "de": "Geschnetzeltes H\xE4hnchen, Cheddar, Champignons, wei\xDFe So\xDFe.",
            "ar": "\u0634\u0631\u0627\u0626\u062D \u062F\u062C\u0627\u062C \u0645\u062A\u0628\u0644\u0629\u060C \u062C\u0628\u0646\u0629 \u0634\u064A\u062F\u0631\u060C \u0641\u0637\u0631 \u0637\u0627\u0632\u062C\u060C \u0648\u0635\u0644\u0635\u0629 \u0628\u064A\u0636\u0627\u0621 \u0643\u0631\u064A\u0645\u064A\u0629."
          },
          "price": "54",
          "image": "images/sand-cheesesteak.webp",
          "isNew": true
        },
        {
          "name": {
            "fr": "POULET CRUNCHY",
            "en": "CRUNCHY CHICKEN",
            "de": "KNUSPRIGES H\xC4HNCHEN",
            "ar": "\u0633\u0627\u0646\u062F\u0648\u064A\u062A\u0634 \u062F\u062C\u0627\u062C \u0643\u0631\u0627\u0646\u0634\u064A \u0645\u0642\u0631\u0645\u0634"
          },
          "description": {
            "fr": "B\xE2ton de poulet pan\xE9, cheddar, laitue.",
            "en": "Breaded chicken stick, cheddar, lettuce.",
            "de": "Paniertes H\xE4hnchenst\xE4bchen, Cheddar, Salat.",
            "ar": "\u0623\u0635\u0627\u0628\u0639 \u062F\u062C\u0627\u062C \u0645\u0642\u0631\u0645\u0634\u0629\u060C \u062C\u0628\u0646\u0629 \u0634\u064A\u062F\u0631\u060C \u0648\u062E\u0633 \u0637\u0627\u0632\u062C."
          },
          "price": "58",
          "image": "images/sand-crunchy.webp"
        },
        {
          "name": {
            "fr": "VIANDE HACH\xC9E",
            "en": "MINCED MEAT",
            "de": "HACKFLEISCH",
            "ar": "\u0633\u0627\u0646\u062F\u0648\u064A\u062A\u0634 \u0643\u0641\u062A\u0629 \u0645\u0634\u0648\u064A\u0629 \u062A\u0634\u0627\u0628\u0627\u062A\u0627"
          },
          "description": {
            "fr": "Viande hach\xE9e, tomate, salade, sauce sp\xE9ciale, cheddar.",
            "en": "Minced meat, tomato, salad, special sauce, cheddar.",
            "de": "Hackfleisch, Tomate, Salat, Spezialso\xDFe, Cheddar.",
            "ar": "\u0644\u062D\u0645 \u0645\u0641\u0631\u0648\u0645 (\u0643\u0641\u062A\u0629)\u060C \u0637\u0645\u0627\u0637\u0645\u060C \u0633\u0644\u0637\u0629 \u062E\u0636\u0631\u0627\u0621\u060C \u0635\u0644\u0635\u0629 \u062E\u0627\u0635\u0629\u060C \u0648\u062C\u0628\u0646\u0629 \u0634\u064A\u062F\u0631 \u0630\u0627\u0626\u0628\u0629."
          },
          "price": "54",
          "image": "images/sand-hache.webp"
        },
        {
          "name": {
            "fr": "POULET",
            "en": "CHICKEN",
            "de": "H\xC4HNCHEN",
            "ar": "\u0633\u0627\u0646\u062F\u0648\u064A\u062A\u0634 \u062F\u062C\u0627\u062C \u0645\u0634\u0648\u064A \u062A\u0634\u0627\u0628\u0627\u062A\u0627"
          },
          "description": {
            "fr": "Blanc de Poulet, cheddar, salade, tomate.",
            "en": "Chicken breast, cheddar, salad, tomato.",
            "de": "H\xE4hnchenbrust, Cheddar, Salat, Tomate.",
            "ar": "\u0635\u062F\u0631 \u062F\u062C\u0627\u062C \u0645\u0634\u0648\u064A\u060C \u062C\u0628\u0646\u0629 \u0634\u064A\u062F\u0631\u060C \u0633\u0644\u0637\u0629\u060C \u0648\u0637\u0645\u0627\u0637\u0645 \u0637\u0627\u0632\u062C\u0629."
          },
          "price": "48",
          "image": "images/sand-poulet.webp"
        },
        {
          "name": {
            "fr": "THON",
            "en": "TUNA",
            "de": "THUNFISCH",
            "ar": "\u0633\u0627\u0646\u062F\u0648\u064A\u062A\u0634 \u062A\u0648\u0646\u0629 \u062A\u0634\u0627\u0628\u0627\u062A\u0627"
          },
          "description": {
            "fr": "Thon, sauce burger, oignon, salade, tomate, cheddar.",
            "en": "Tuna, burger sauce, onion, salad, tomato, cheddar.",
            "de": "Thunfisch, Burgerso\xDFe, Zwiebel, Salat, Tomate, Cheddar.",
            "ar": "\u062A\u0648\u0646\u0629 \u0645\u0645\u062A\u0627\u0632\u0629\u060C \u0635\u0644\u0635\u0629 \u0627\u0644\u0628\u0631\u062C\u0631\u060C \u0628\u0635\u0644\u060C \u0633\u0644\u0637\u0629\u060C \u0637\u0645\u0627\u0637\u0645\u060C \u0648\u062C\u0628\u0646\u0629 \u0634\u064A\u062F\u0631."
          },
          "price": "48",
          "image": "images/sand-thon.webp"
        }
      ]
    },
    {
      "category": {
        "fr": "BURGERS",
        "en": "BURGERS",
        "de": "BURGER",
        "ar": "\u0627\u0644\u0628\u0631\u062C\u0631"
      },
      "id": "burgers",
      "items": [
        {
          "name": {
            "fr": "CHICKEN BURGER",
            "en": "CHICKEN BURGER",
            "de": "H\xE4hnchen-Burger",
            "ar": "\u062A\u0634\u064A\u0643\u0646 \u0628\u0631\u062C\u0631 \u0645\u0642\u0631\u0645\u0634"
          },
          "description": {
            "fr": "poulet assaisonn\xE9es, cheddar, laitue, tomate, oignon, cornichon, sauce biggy",
            "en": "Seasoned chicken, cheddar, lettuce, tomato, onion, pickle, Biggy sauce.",
            "de": "Gew\xFCrztes H\xE4hnchen, Cheddar, Salat, Tomate, Zwiebel, Gurke, Biggy-Sauce.",
            "ar": "\u062F\u062C\u0627\u062C \u0645\u062A\u0628\u0644 \u0645\u0642\u0631\u0645\u0634\u060C \u062C\u0628\u0646\u0629 \u0634\u064A\u062F\u0631\u060C \u062E\u0633\u060C \u0637\u0645\u0627\u0637\u0645\u060C \u0628\u0635\u0644\u060C \u062E\u064A\u0627\u0631 \u0645\u062E\u0644\u0644 (\u0643\u0648\u0631\u0646\u064A\u0634\u0648\u0646)\u060C \u0648\u0635\u0644\u0635\u0629 \u0628\u064A\u063A\u064A \u0627\u0644\u0634\u0647\u064A\u0631\u0629."
          },
          "price": "50",
          "image": "images/burger-cheese.webp",
          "isNew": true
        },
        {
          "name": {
            "fr": "BURGER ROYAL",
            "en": "ROYAL BURGER",
            "de": "ROYAL BURGER",
            "ar": "\u0628\u0631\u062C\u0631 \u0631\u0648\u064A\u0627\u0644 \u0627\u0644\u0645\u0644\u0643\u064A"
          },
          "description": {
            "fr": "Viande hach\xE9e, poulet pan\xE9, cheddar, oignons caram\xE9lis\xE9s, laitue, tomate, sauce sp\xE9ciale.",
            "en": "Minced meat, breaded chicken, cheddar, caramelized onions, lettuce, tomato, special sauce.",
            "de": "Hackfleisch, paniertes H\xE4hnchen, Cheddar, karamellisierte Zwiebeln, Salat, Tomate, Spezialso\xDFe.",
            "ar": "\u0644\u062D\u0645 \u0645\u0641\u0631\u0648\u0645\u060C \u062F\u062C\u0627\u062C \u0628\u0627\u0646\u064A\u0647 \u0645\u0642\u0631\u0645\u0634\u060C \u062C\u0628\u0646\u0629 \u0634\u064A\u062F\u0631\u060C \u0628\u0635\u0644 \u0645\u0643\u0631\u0645\u0644\u060C \u062E\u0633\u060C \u0637\u0645\u0627\u0637\u0645\u060C \u0648\u0635\u0644\u0635\u0629 \u062E\u0627\u0635\u0629."
          },
          "price": "70",
          "image": "images/burger-royal.webp"
        },
        {
          "name": {
            "fr": "BIG BURGER",
            "en": "BIG BURGER",
            "de": "BIG BURGER",
            "ar": "\u0628\u064A\u063A \u0628\u0631\u062C\u0631 \u062F\u0628\u0644 \u0644\u062D\u0645"
          },
          "description": {
            "fr": "2 viandes hach\xE9es, fromage cheddar, laitue, tomate, oignon, sauce du chef.",
            "en": "2 minced meats, cheddar cheese, lettuce, tomato, onion, chef's sauce.",
            "de": "2 Hackfleischpatties, Cheddar-K\xE4se, Salat, Tomate, Zwiebel, So\xDFe des Chefkochs.",
            "ar": "\u0634\u0631\u064A\u062D\u062A\u0627 \u0644\u062D\u0645 \u0645\u0641\u0631\u0648\u0645\u060C \u062C\u0628\u0646\u0629 \u0634\u064A\u062F\u0631\u060C \u062E\u0633\u060C \u0637\u0645\u0627\u0637\u0645\u060C \u0628\u0635\u0644\u060C \u0648\u0635\u0644\u0635\u0629 \u0627\u0644\u0634\u064A\u0641 \u0627\u0644\u062E\u0627\u0635\u0629."
          },
          "price": "68",
          "image": "images/burger-big.webp"
        },
        {
          "name": {
            "fr": "CHEESE BURGER",
            "en": "CHEESE BURGER",
            "de": "CHEESE BURGER",
            "ar": "\u062A\u0634\u064A\u0632 \u0628\u0631\u062C\u0631 \u0643\u0644\u0627\u0633\u064A\u0643"
          },
          "description": {
            "fr": "Viande hach\xE9e, cheddar, laitue, tomate, oignon, cornichon, sauce burger.",
            "en": "Minced meat, cheddar, lettuce, tomato, onion, pickle, burger sauce.",
            "de": "Hackfleisch, Cheddar, Salat, Tomate, Zwiebel, Gurke, Burgerso\xDFe.",
            "ar": "\u0644\u062D\u0645 \u0645\u0641\u0631\u0648\u0645\u060C \u062C\u0628\u0646\u0629 \u0634\u064A\u062F\u0631\u060C \u062E\u0633\u060C \u0637\u0645\u0627\u0637\u0645\u060C \u0628\u0635\u0644\u060C \u062E\u064A\u0627\u0631 \u0645\u062E\u0644\u0644\u060C \u0648\u0635\u0644\u0635\u0629 \u0627\u0644\u0628\u0631\u062C\u0631."
          },
          "price": "54",
          "image": "images/burger-cheese.webp"
        }
      ]
    },
    {
      "category": {
        "fr": "PANINI",
        "en": "PANINI",
        "de": "PANINI",
        "ar": "\u0627\u0644\u0628\u0627\u0646\u064A\u0646\u064A \u0648 \u0627\u0644\u0631\u0627\u0628"
      },
      "id": "panini",
      "items": [
        {
          "name": {
            "fr": "FRUIT DE MER",
            "en": "SEAFOOD",
            "de": "MEERESFR\xDCCHTE",
            "ar": "\u0628\u0627\u0646\u064A\u0646\u064A \u0641\u0648\u0627\u0643\u0647 \u0627\u0644\u0628\u062D\u0631"
          },
          "description": {
            "fr": "Crevettes, calamars, sauce de chef.",
            "en": "Shrimp, calamari, chef's sauce.",
            "de": "Garnelen, Tintenfisch, So\xDFe des Chefkochs.",
            "ar": "\u062C\u0645\u0628\u0631\u064A\u060C \u0643\u0644\u0645\u0627\u0631\u060C \u0648\u0635\u0644\u0635\u0629 \u0627\u0644\u0634\u064A\u0641 \u0641\u064A \u062E\u0628\u0632 \u0628\u0627\u0646\u064A\u0646\u064A \u0645\u062D\u0645\u0635 \u0648\u0645\u0642\u0631\u0645\u0634."
          },
          "price": "64",
          "image": "images/panini-fruitsmer.webp"
        },
        {
          "name": {
            "fr": "MIXTE ",
            "en": " MIX",
            "de": "MIX",
            "ar": "\u0628\u0627\u0646\u064A\u0646\u064A \u0645\u0634\u0643\u0644 (\u0645\u064A\u0643\u0633\u062A)"
          },
          "description": {
            "fr": "M\xE9lange de viande hach\xE9e et poulet, charcuterie, fromage.",
            "en": "Mix of minced meat and chicken, cold cuts, cheese.",
            "de": "Mischung aus Hackfleisch und H\xE4hnchen, Aufschnitt, K\xE4se.",
            "ar": "\u0645\u0632\u064A\u062C \u0644\u0630\u064A\u0630 \u0645\u0646 \u0627\u0644\u0644\u062D\u0645 \u0627\u0644\u0645\u0641\u0631\u0648\u0645 \u0648\u0627\u0644\u062F\u062C\u0627\u062C\u060C \u0634\u0627\u0631\u0643\u0648\u062A\u0631\u064A\u060C \u0648\u062C\u0628\u0646 \u0630\u0627\u0626\u0628."
          },
          "price": "58",
          "image": "images/panini-mixte.webp"
        },
        {
          "name": {
            "fr": "VIANDE HACH\xC9E",
            "en": "MINCED MEAT",
            "de": "HACKFLEISCH",
            "ar": "\u0628\u0627\u0646\u064A\u0646\u064A \u0643\u0641\u062A\u0629 \u0628\u0627\u0644\u062C\u0628\u0646"
          },
          "description": {
            "fr": "Viande hach\xE9e, fromage, sauce burger.",
            "en": "Minced meat, cheese, burger sauce.",
            "de": "Hackfleisch, K\xE4se, Burgerso\xDFe.",
            "ar": "\u0644\u062D\u0645 \u0645\u0641\u0631\u0648\u0645 \u0645\u062A\u0628\u0644\u060C \u062C\u0628\u0646 \u0630\u0627\u0626\u0628\u060C \u0648\u0635\u0644\u0635\u0629 \u0628\u0631\u062C\u0631 \u0645\u0645\u064A\u0632\u0629."
          },
          "price": "54",
          "image": "images/panini-hache.webp"
        },
        {
          "name": {
            "fr": "POULET",
            "en": "CHICKEN",
            "de": "H\xC4HNCHEN",
            "ar": "\u0628\u0627\u0646\u064A\u0646\u064A \u062F\u062C\u0627\u062C \u0645\u0634\u0648\u064A"
          },
          "description": {
            "fr": "Poulet grill\xE9, fromage, sauce burger.",
            "en": "Grilled chicken, cheese, burger sauce.",
            "de": "Gegrilltes H\xE4hnchen, K\xE4se, Burgerso\xDFe.",
            "ar": "\u062F\u062C\u0627\u062C \u0645\u0634\u0648\u064A\u060C \u062C\u0628\u0646 \u0630\u0627\u0626\u0628\u060C \u0648\u0635\u0644\u0635\u0629 \u0628\u0631\u062C\u0631."
          },
          "price": "44",
          "image": "images/panini-poulet.webp"
        },
        {
          "name": {
            "fr": "WRAP POULET",
            "en": "WRAP CHICKEN",
            "de": "WRAP H\xC4HNCHEN",
            "ar": "\u0631\u0627\u0628 \u062F\u062C\u0627\u062C \u0645\u0642\u0631\u0645\u0634"
          },
          "description": {
            "fr": "poulet pan\xE9, , cheddar ,tomate, laitue ,sauce",
            "en": "Breaded chicken, cheddar, tomato, lettuce, sauce.",
            "de": "Panierter H\xE4hnchen, Cheddar, Tomate, Salat, Sauce.",
            "ar": "\u062F\u062C\u0627\u062C \u0645\u0642\u0631\u0645\u0634 (\u0628\u0627\u0646\u064A\u0647)\u060C \u062C\u0628\u0646\u0629 \u0634\u064A\u062F\u0631\u060C \u0637\u0645\u0627\u0637\u0645\u060C \u062E\u0633 \u0637\u0627\u0632\u062C\u060C \u0648\u0635\u0644\u0635\u0629 \u062E\u0627\u0635\u0629 \u0641\u064A \u062E\u0628\u0632 \u0627\u0644\u062A\u0648\u0631\u062A\u064A\u0644\u0627."
          },
          "price": "58",
          "image": "images/Wrap-poulet.webp",
          "isNew": true
        },
        {
          "name": {
            "fr": "WRAP VIANDE HACH\xC9E",
            "en": "WRAP MINCED MEAT",
            "de": "WRAP HACKFLEISCH",
            "ar": "\u0631\u0627\u0628 \u0643\u0641\u062A\u0629 \u0645\u062A\u0628\u0644\u0629"
          },
          "description": {
            "fr": "Viande hachee, cheddar ,tomate, laitue ,sauce",
            "en": "Ground beef, cheddar, tomato, lettuce, sauce.",
            "de": "Hackfleisch, Cheddar, Tomate, Salat, Sauce.",
            "ar": "\u0644\u062D\u0645 \u0645\u0641\u0631\u0648\u0645 \u0645\u062A\u0628\u0644\u060C \u062C\u0628\u0646\u0629 \u0634\u064A\u062F\u0631\u060C \u0637\u0645\u0627\u0637\u0645\u060C \u062E\u0633 \u0637\u0627\u0632\u062C\u060C \u0648\u0635\u0644\u0635\u0629 \u062E\u0627\u0635\u0629 \u0641\u064A \u062E\u0628\u0632 \u0627\u0644\u062A\u0648\u0631\u062A\u064A\u0644\u0627."
          },
          "price": "62",
          "image": "images/Wrap-viande-hachee.webp",
          "isNew": true
        },
        {
          "name": {
            "fr": "WRAP GOURMAND ",
            "en": " Gourmet wrap",
            "de": "Gourmet wrap",
            "ar": "\u0631\u0627\u0628 \u063A\u0648\u0631\u0645\u0627\u0646\u062F \u0627\u0644\u0645\u0634\u0643\u0644"
          },
          "description": {
            "fr": "poulet pan\xE9, charcuterie, cheddar ,tomate, laitue ,sauce.",
            "en": "Breaded chicken, charcuterie, cheddar, tomato, lettuce, sauce.",
            "de": "Panierter H\xE4hnchen, Wurstwaren, Cheddar, Tomate, Salat, Sauce.",
            "ar": "\u062F\u062C\u0627\u062C \u0645\u0642\u0631\u0645\u0634\u060C \u0634\u0627\u0631\u0643\u0648\u062A\u0631\u064A\u060C \u062C\u0628\u0646\u0629 \u0634\u064A\u062F\u0631\u060C \u0637\u0645\u0627\u0637\u0645\u060C \u062E\u0633\u060C \u0648\u0635\u0644\u0635\u0629 \u0641\u064A \u062E\u0628\u0632 \u0627\u0644\u062A\u0648\u0631\u062A\u064A\u0644\u0627 \u0627\u0644\u0645\u062D\u0645\u0635."
          },
          "price": "64",
          "image": "images/Wrap-gourmand.webp",
          "isNew": true
        }
      ]
    },
    {
      "category": {
        "fr": "PIZZA",
        "en": "PIZZA",
        "de": "PIZZA",
        "ar": "\u0627\u0644\u0628\u064A\u062A\u0632\u0627"
      },
      "id": "pizza",
      "items": [
        {
          "name": {
            "fr": "FRUITS DE MER",
            "en": "SEAFOOD",
            "de": "MEERESFR\xDCCHTE",
            "ar": "\u0628\u064A\u062A\u0632\u0627 \u0641\u0648\u0627\u0643\u0647 \u0627\u0644\u0628\u062D\u0631"
          },
          "description": {
            "fr": "Crevettes, calamars, moules, champignon, sauce blanche, mozzarella.",
            "en": "Shrimp, calamari, mussels, mushroom, white sauce, mozzarella.",
            "de": "Garnelen, Tintenfisch, Muscheln, Pilz, wei\xDFe So\xDFe, Mozzarella.",
            "ar": "\u062C\u0645\u0628\u0631\u064A\u060C \u0643\u0644\u0645\u0627\u0631\u060C \u0628\u0644\u062D \u0627\u0644\u0628\u062D\u0631\u060C \u0641\u0637\u0631\u060C \u0635\u0644\u0635\u0629 \u0628\u064A\u0636\u0627\u0621\u060C \u0648\u062C\u0628\u0646\u0629 \u0645\u0648\u0632\u0627\u0631\u064A\u0644\u0627 \u0630\u0627\u0626\u0628\u0629."
          },
          "price": "88",
          "image": "images/pizza-fruitsmer.webp"
        },
        {
          "name": {
            "fr": "4 SAISONS",
            "en": "4 SEASONS",
            "de": "4 JAHRESZEITEN",
            "ar": "\u0628\u064A\u062A\u0632\u0627 \u0627\u0644\u0641\u0635\u0648\u0644 \u0627\u0644\u0623\u0631\u0628\u0639\u0629"
          },
          "description": {
            "fr": "Fruit de mer, viande hach\xE9e, poulet, v\xE9g\xE9tarienne, mozzarella.",
            "en": "Seafood, minced meat, chicken, vegetarian, mozzarella.",
            "de": "Meeresfr\xFCchte, Hackfleisch, H\xE4hnchen, Vegetarisch, Mozzarella.",
            "ar": "\u0641\u0648\u0627\u0643\u0647 \u0627\u0644\u0628\u062D\u0631\u060C \u0644\u062D\u0645 \u0645\u0641\u0631\u0648\u0645\u060C \u062F\u062C\u0627\u062C\u060C \u062E\u0636\u0627\u0631\u060C \u0648\u062C\u0628\u0646\u0629 \u0645\u0648\u0632\u0627\u0631\u064A\u0644\u0627."
          },
          "price": "88",
          "image": "images/pizza-4saisons.webp"
        },
        {
          "name": {
            "fr": "MOITI\xC9 MOITI\xC9",
            "en": "HALF AND HALF",
            "de": "HALB UND HALB",
            "ar": "\u0628\u064A\u062A\u0632\u0627 \u0646\u0635\u0641\u064A\u0646 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643"
          },
          "description": {
            "fr": "Tout sauf fruits de mer et saumon.",
            "en": "Everything except seafood and salmon.",
            "de": "Alles au\xDFer Meeresfr\xFCchten und Lachs.",
            "ar": "\u0646\u0635\u0641\u0627\u0646 \u0628\u0646\u0643\u0647\u062A\u064A\u0646 \u0645\u062E\u062A\u0644\u0641\u062A\u064A\u0646 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643 (\u0628\u0627\u0633\u062A\u062B\u0646\u0627\u0621 \u0641\u0648\u0627\u0643\u0647 \u0627\u0644\u0628\u062D\u0631 \u0648\u0627\u0644\u0633\u0644\u0645\u0648\u0646)."
          },
          "price": "88",
          "image": "images/pizza-moitiemoitie.webp"
        },
        {
          "name": {
            "fr": "POULET SAUCE BLANCHE",
            "en": "CHICKEN WHITE SAUCE",
            "de": "H\xC4HNCHEN WEISSE SO\xDFE",
            "ar": "\u0628\u064A\u062A\u0632\u0627 \u062F\u062C\u0627\u062C \u0628\u0627\u0644\u0635\u0644\u0635\u0629 \u0627\u0644\u0628\u064A\u0636\u0627\u0621"
          },
          "description": {
            "fr": "Poulet, sauce blanche, champignon, mozzarella.",
            "en": "Chicken, white sauce, mushroom, mozzarella.",
            "de": "H\xE4hnchen, wei\xDFe So\xDFe, Pilz, Mozzarella.",
            "ar": "\u062F\u062C\u0627\u062C\u060C \u0635\u0644\u0635\u0629 \u0628\u064A\u0636\u0627\u0621 \u0643\u0631\u064A\u0645\u064A\u0629\u060C \u0641\u0637\u0631 \u0637\u0627\u0632\u062C\u060C \u0648\u062C\u0628\u0646\u0629 \u0645\u0648\u0632\u0627\u0631\u064A\u0644\u0627."
          },
          "price": "78",
          "image": "images/pizza-pouletblanche.webp"
        },
        {
          "name": {
            "fr": "5 FROMAGES",
            "en": "5 CHEESES",
            "de": "5 K\xC4SE",
            "ar": "\u0628\u064A\u062A\u0632\u0627 5 \u0623\u062C\u0628\u0627\u0646 \u063A\u0646\u064A\u0629"
          },
          "description": {
            "fr": "Sauce tomate, mozzarella, bleu, parmesan, gouda, camembert.",
            "en": "Tomato sauce, mozzarella, blue cheese, parmesan, gouda, camembert.",
            "de": "Tomatenso\xDFe, Mozzarella, Blauschimmelk\xE4se, Parmesan, Gouda, Camembert.",
            "ar": "\u0635\u0644\u0635\u0629 \u0637\u0645\u0627\u0637\u0645\u060C \u0645\u0648\u0632\u0627\u0631\u064A\u0644\u0627\u060C \u062C\u0628\u0646 \u0623\u0632\u0631\u0642 (\u0628\u0644\u0648)\u060C \u0628\u0627\u0631\u0645\u064A\u0632\u0627\u0646\u060C \u063A\u0648\u062F\u0627\u060C \u0648\u062C\u0628\u0646\u0629 \u0643\u0627\u0645\u0645\u0628\u0631\u062A."
          },
          "price": "78",
          "image": "images/pizza-5fromages.webp"
        },
        {
          "name": {
            "fr": "VIANDE HACH\xC9E",
            "en": "MINCED MEAT",
            "de": "HACKFLEISCH",
            "ar": "\u0628\u064A\u062A\u0632\u0627 \u0643\u0641\u062A\u0629 (\u0644\u062D\u0645 \u0645\u0641\u0631\u0648\u0645)"
          },
          "description": {
            "fr": "Viande hach\xE9e, tomate cerise, sauce tomate, mozzarella.",
            "en": "Minced meat, cherry tomato, tomato sauce, mozzarella.",
            "de": "Hackfleisch, Kirschtomate, Tomatenso\xDFe, Mozzarella.",
            "ar": "\u0644\u062D\u0645 \u0645\u0641\u0631\u0648\u0645 \u0645\u062A\u0628\u0644\u060C \u0637\u0645\u0627\u0637\u0645 \u0643\u0631\u0632\u064A\u0629\u060C \u0635\u0644\u0635\u0629 \u0637\u0645\u0627\u0637\u0645\u060C \u0648\u062C\u0628\u0646\u0629 \u0645\u0648\u0632\u0627\u0631\u064A\u0644\u0627."
          },
          "price": "78",
          "image": "images/pizza-hache.webp"
        },
        {
          "name": {
            "fr": "PEPPERONI",
            "en": "PEPPERONI",
            "de": "PEPPERONI",
            "ar": "\u0628\u064A\u062A\u0632\u0627 \u0628\u064A\u0628\u0631\u0648\u0646\u064A"
          },
          "description": {
            "fr": "Pepp\xE9roni, Sauce tomate, mozzarella.",
            "en": "Pepperoni, tomato sauce, mozzarella.",
            "de": "Pepperoni, Tomatenso\xDFe, Mozzarella.",
            "ar": "\u0628\u064A\u0628\u0631\u0648\u0646\u064A \u0628\u0642\u0631\u064A\u060C \u0635\u0644\u0635\u0629 \u0637\u0645\u0627\u0637\u0645 \u0645\u062A\u0628\u0644\u0629\u060C \u0648\u062C\u0628\u0646\u0629 \u0645\u0648\u0632\u0627\u0631\u064A\u0644\u0627 \u0630\u0627\u0626\u0628\u0629."
          },
          "price": "74",
          "image": "images/pizza-pepperoni.webp"
        },
        {
          "name": {
            "fr": "REGINA",
            "en": "REGINA",
            "de": "REGINA",
            "ar": "\u0628\u064A\u062A\u0632\u0627 \u0631\u064A\u062C\u064A\u0646\u0627 \u0627\u0644\u0625\u064A\u0637\u0627\u0644\u064A\u0629"
          },
          "description": {
            "fr": "Dinde fum\xE9e, champignon frais, mozzarella, sauce blanche.",
            "en": "Smoked turkey, fresh mushroom, mozzarella, white sauce.",
            "de": "Ger\xE4ucherte Pute, frischer Pilz, Mozzarella, wei\xDFe So\xDFe.",
            "ar": "\u062F\u064A\u0643 \u0631\u0648\u0645\u064A \u0645\u062F\u062E\u0646\u060C \u0641\u0637\u0631 \u0637\u0627\u0632\u062C\u060C \u062C\u0628\u0646\u0629 \u0645\u0648\u0632\u0627\u0631\u064A\u0644\u0627\u060C \u0648\u0635\u0644\u0635\u0629 \u0628\u064A\u0636\u0627\u0621."
          },
          "price": "68",
          "image": "images/pizza-regina.webp"
        },
        {
          "name": {
            "fr": "THON",
            "en": "TUNA",
            "de": "THUNFISCH",
            "ar": "\u0628\u064A\u062A\u0632\u0627 \u0627\u0644\u062A\u0648\u0646\u0629 \u0648\u0627\u0644\u0632\u064A\u062A\u0648\u0646"
          },
          "description": {
            "fr": "Thon, oignons, olives noires, mozzarella.",
            "en": "Tuna, onions, black olives, mozzarella.",
            "de": "Thunfisch, Zwiebeln, schwarze Oliven, Mozzarella.",
            "ar": "\u062A\u0648\u0646\u0629\u060C \u0628\u0635\u0644\u060C \u0632\u064A\u062A\u0648\u0646 \u0623\u0633\u0648\u062F\u060C \u0648\u062C\u0628\u0646\u0629 \u0645\u0648\u0632\u0627\u0631\u064A\u0644\u0627."
          },
          "price": "65",
          "image": "images/pizza-thon.webp"
        },
        {
          "name": {
            "fr": "VEGETARIENNE",
            "en": "VEGETARIAN",
            "de": "VEGETARISCH",
            "ar": "\u0628\u064A\u062A\u0632\u0627 \u0646\u0628\u0627\u062A\u064A\u0629 \u0628\u0627\u0644\u062E\u0636\u0627\u0631"
          },
          "description": {
            "fr": "L\xE9gumes vari\xE9s (poivrons, champignons, oignons, courgettes), sauce pesto, mozzarella.",
            "en": "Assorted vegetables (peppers, mushrooms, onions, zucchini), pesto sauce, mozzarella.",
            "de": "Verschiedenes Gem\xFCse (Paprika, Pilze, Zucchini), Pesto-So\xDFe, Mozzarella.",
            "ar": "\u062E\u0636\u0627\u0631 \u0645\u0634\u0643\u0644\u0629 (\u0641\u0644\u0641\u0644\u060C \u0641\u0637\u0631\u060C \u0628\u0635\u0644\u060C \u0642\u0631\u0639 \u0623\u062E\u0636\u0631)\u060C \u0635\u0644\u0635\u0629 \u0628\u064A\u0633\u062A\u0648\u060C \u0648\u062C\u0628\u0646\u0629 \u0645\u0648\u0632\u0627\u0631\u064A\u0644\u0627."
          },
          "price": "62",
          "image": "images/pizza-veggie.webp"
        },
        {
          "name": {
            "fr": "MARGARITA",
            "en": "MARGARITA",
            "de": "MARGARITA",
            "ar": "\u0628\u064A\u062A\u0632\u0627 \u0645\u0627\u0631\u063A\u0631\u064A\u062A\u0627 \u0643\u0644\u0627\u0633\u064A\u0643"
          },
          "description": {
            "fr": "Sauce tomate, basilic, olives noires, mozzarella.",
            "en": "Tomato sauce, basil, black olives, mozzarella.",
            "de": "Tomatenso\xDFe, Basilikum, schwarze Oliven, Mozzarella.",
            "ar": "\u0635\u0644\u0635\u0629 \u0637\u0645\u0627\u0637\u0645 \u0625\u064A\u0637\u0627\u0644\u064A\u0629\u060C \u0631\u064A\u062D\u0627\u0646 \u0637\u0627\u0632\u062C\u060C \u0632\u064A\u062A\u0648\u0646 \u0623\u0633\u0648\u062F\u060C \u0648\u062C\u0628\u0646\u0629 \u0645\u0648\u0632\u0627\u0631\u064A\u0644\u0627."
          },
          "price": "52",
          "image": "images/pizza-margherita.webp"
        }
      ]
    },
    {
      "category": {
        "fr": "Pasta (Spaghettis, Tagliatelles, Linguines)",
        "en": "Pasta (Spaghetti, Tagliatelle, Linguine)",
        "de": "Pasta (Spaghetti, Tagliatelle, Linguine)",
        "ar": "\u0627\u0644\u0628\u0627\u0633\u062A\u0627 \u0648\u0627\u0644\u0644\u0627\u0632\u0627\u0646\u064A\u0627"
      },
      "id": "pasta",
      "items": [
        {
          "name": {
            "fr": "SAUMON",
            "en": "SALMON",
            "de": "LACHS",
            "ar": "\u0628\u0627\u0633\u062A\u0627 \u0627\u0644\u0633\u0644\u0645\u0648\u0646 \u0628\u0627\u0644\u0643\u0631\u064A\u0645\u0629 \u0648\u0627\u0644\u0628\u0627\u0631\u0645\u064A\u0632\u0627\u0646"
          },
          "description": {
            "fr": "P\xE2tes, saumon frais, aneth, parmesan.",
            "en": "Pasta, fresh salmon, dill, parmesan.",
            "de": "Pasta, frischer Lachs, Dill, Parmesan.",
            "ar": "\u0645\u0643\u0631\u0648\u0646\u0629\u060C \u0633\u0644\u0645\u0648\u0646 \u0637\u0627\u0632\u062C\u060C \u0634\u0628\u062A (\u0623\u0646\u0628\u062A)\u060C \u0648\u062C\u0628\u0646\u0629 \u0628\u0627\u0631\u0645\u064A\u0632\u0627\u0646 \u0625\u064A\u0637\u0627\u0644\u064A\u0629."
          },
          "price": "98",
          "image": "images/pasta-saumon.webp"
        },
        {
          "name": {
            "fr": "FRUITS DE MER",
            "en": "SEAFOOD",
            "de": "MEERESFR\xDCCHTE",
            "ar": "\u0628\u0627\u0633\u062A\u0627 \u0641\u0648\u0627\u0643\u0647 \u0627\u0644\u0628\u062D\u0631 \u0628\u0627\u0644\u0635\u0644\u0635\u0629 \u0627\u0644\u0628\u064A\u0636\u0627\u0621"
          },
          "description": {
            "fr": "P\xE2tes, crevettes, calamars, moules, sauce blanche.",
            "en": "Pasta, shrimp, calamari, mussels, white sauce.",
            "de": "Pasta, Garnelen, Tintenfisch, Muscheln, wei\xDFe So\xDFe.",
            "ar": "\u0645\u0643\u0631\u0648\u0646\u0629\u060C \u062C\u0645\u0628\u0631\u064A\u060C \u0643\u0644\u0645\u0627\u0631\u060C \u0628\u0644\u062D \u0627\u0644\u0628\u062D\u0631\u060C \u0648\u0635\u0644\u0635\u0629 \u0628\u064A\u0636\u0627\u0621 \u0643\u0631\u064A\u0645\u064A\u0629."
          },
          "price": "88",
          "image": "images/pasta-fruitsmer.webp"
        },
        {
          "name": {
            "fr": "POULET CHAMPIGNON / EPINARD",
            "en": "CHICKEN MUSHROOM / SPINACH",
            "de": "H\xC4HNCHEN PILZ / SPINAT",
            "ar": "\u0628\u0627\u0633\u062A\u0627 \u062F\u062C\u0627\u062C \u0628\u0627\u0644\u0641\u0637\u0631 \u0648\u0627\u0644\u0633\u0628\u0627\u0646\u062E"
          },
          "description": {
            "fr": "P\xE2tes, poulet, champignon, \xE9pinard, parmesan.",
            "en": "Pasta, chicken, mushroom, spinach, parmesan.",
            "de": "Pasta, H\xE4hnchen, Pilz, Spinat, Parmesan.",
            "ar": "\u0645\u0643\u0631\u0648\u0646\u0629\u060C \u062F\u062C\u0627\u062C \u0645\u062A\u0628\u0644\u060C \u0641\u0637\u0631 \u0637\u0627\u0632\u062C\u060C \u0633\u0628\u0627\u0646\u062E\u060C \u0648\u062C\u0628\u0646\u0629 \u0628\u0627\u0631\u0645\u064A\u0632\u0627\u0646."
          },
          "price": "75",
          "image": "images/pasta-poulet.webp"
        },
        {
          "name": {
            "fr": "BOLOGNAISE",
            "en": "BOLOGNESE",
            "de": "BOLOGNESE",
            "ar": "\u0628\u0627\u0633\u062A\u0627 \u0628\u0648\u0644\u0648\u0646\u064A\u0632 \u0628\u0627\u0644\u0644\u062D\u0645 \u0627\u0644\u0645\u0641\u0631\u0648\u0645"
          },
          "description": {
            "fr": "P\xE2tes, sauce bolognaise \xE0 la viande hach\xE9e, tomate cerise.",
            "en": "Pasta, Bolognese sauce with minced meat, cherry tomato.",
            "de": "Pasta, Bolognese-So\xDFe mit Hackfleisch, Kirschtomate.",
            "ar": "\u0645\u0643\u0631\u0648\u0646\u0629\u060C \u0635\u0644\u0635\u0629 \u0628\u0648\u0644\u0648\u0646\u064A\u0632 \u063A\u0646\u064A\u0629 \u0628\u0627\u0644\u0644\u062D\u0645 \u0627\u0644\u0645\u0641\u0631\u0648\u0645\u060C \u0648\u0637\u0645\u0627\u0637\u0645 \u0643\u0631\u0632\u064A\u0629."
          },
          "price": "75",
          "image": "images/pasta-bolognaise.webp"
        },
        {
          "name": {
            "fr": "CARBONARA",
            "en": "CARBONARA",
            "de": "CARBONARA",
            "ar": "\u0628\u0627\u0633\u062A\u0627 \u0643\u0627\u0631\u0628\u0648\u0646\u0627\u0631\u0627"
          },
          "description": {
            "fr": "P\xE2tes, jambon dinde, parmesan.",
            "en": "Pasta, turkey ham, parmesan.",
            "de": "Pasta, Putenschinken, Parmesan.",
            "ar": "\u0645\u0643\u0631\u0648\u0646\u0629\u060C \u062C\u0627\u0645\u0628\u0648\u0646 \u062F\u064A\u0643 \u0631\u0648\u0645\u064A\u060C \u0648\u062C\u0628\u0646\u0629 \u0628\u0627\u0631\u0645\u064A\u0632\u0627\u0646 \u0625\u064A\u0637\u0627\u0644\u064A\u0629 \u0645\u0639 \u0627\u0644\u0635\u0644\u0635\u0629 \u0627\u0644\u0643\u0631\u064A\u0645\u064A\u0629."
          },
          "price": "65",
          "image": "images/pasta-carbonara.webp"
        },
        {
          "name": {
            "fr": "5 FROMAGE",
            "en": "5 CHEESES",
            "de": "5 K\xC4SE",
            "ar": "\u0628\u0627\u0633\u062A\u0627 \u062A\u0634\u0643\u064A\u0644\u0629 5 \u0623\u062C\u0628\u0627\u0646"
          },
          "description": {
            "fr": "P\xE2tes, m\xE9lange de cinq fromages (parmesan, bleu, mozzarella, cheddar, gouda).",
            "en": "Pasta, blend of five cheeses (parmesan, blue, mozzarella, cheddar, gouda).",
            "de": "Pasta, Mischung aus f\xFCnf K\xE4sesorten (Parmesan, Blau, Mozzarella, Cheddar, Gouda).",
            "ar": "\u0645\u0643\u0631\u0648\u0646\u0629 \u0628\u0635\u0644\u0635\u0629 \u062E\u0645\u0633\u0629 \u0623\u062C\u0628\u0627\u0646 \u0641\u0627\u062E\u0631\u0629 (\u0628\u0627\u0631\u0645\u064A\u0632\u0627\u0646\u060C \u062C\u0628\u0646 \u0623\u0632\u0631\u0642\u060C \u0645\u0648\u0632\u0627\u0631\u064A\u0644\u0627\u060C \u0634\u064A\u062F\u0631\u060C \u0648\u063A\u0648\u062F\u0627)."
          },
          "price": "70",
          "image": "images/pasta-5fromages.webp"
        },
        {
          "name": {
            "fr": "VEGETARIEN",
            "en": "VEGETARIAN",
            "de": "VEGETARISCH",
            "ar": "\u0628\u0627\u0633\u062A\u0627 \u0646\u0628\u0627\u062A\u064A\u0629 \u0628\u0627\u0644\u062E\u0636\u0627\u0631 \u0648\u0627\u0644\u0628\u064A\u0633\u062A\u0648"
          },
          "description": {
            "fr": "P\xE2tes, l\xE9gumes vari\xE9s (courgettes, poivrons, tomates), sauce pesto, huile d'olive.",
            "en": "Pasta, assorted vegetables (zucchini, peppers, tomatoes), pesto sauce, olive oil.",
            "de": "Pasta, verschiedenes Gem\xFCse (Zucchini, Paprika, Tomaten), Pesto-So\xDFe, Oliven\xF6l.",
            "ar": "\u0645\u0643\u0631\u0648\u0646\u0629\u060C \u062E\u0636\u0627\u0631 \u0645\u0634\u0643\u0644\u0629 (\u0642\u0631\u0639 \u0623\u062E\u0636\u0631\u060C \u0641\u0644\u0641\u0644\u060C \u0637\u0645\u0627\u0637\u0645)\u060C \u0635\u0644\u0635\u0629 \u0628\u064A\u0633\u062A\u0648\u060C \u0648\u0632\u064A\u062A \u0632\u064A\u062A\u0648\u0646 \u0628\u0643\u0631."
          },
          "price": "60",
          "image": "images/pasta-veg.webp"
        },
        {
          "name": {
            "fr": "LASAGNE POULET CHAMPIGNON ",
            "en": "CHICKEN MUSHROOM LASAGNE",
            "de": "Lasagne mit H\xE4hnchen und Champignons ",
            "ar": "\u0644\u0627\u0632\u0627\u0646\u064A\u0627 \u062F\u062C\u0627\u062C \u0628\u0627\u0644\u0641\u0637\u0631 \u0648\u0627\u0644\u0628\u064A\u0634\u0627\u0645\u064A\u0644"
          },
          "description": {
            "fr": "Poulet, P\xE2tes lasagne, Sauce blanche, B\xE9chamel, fromage",
            "en": "Chicken, lasagne pasta, white sauce, b\xE9chamel, cheese.",
            "de": "H\xE4hnchen, Lasagne-Nudeln, wei\xDFe Sauce, B\xE9chamelsauce, K\xE4se",
            "ar": "\u0637\u0628\u0642\u0627\u062A \u0644\u0627\u0632\u0627\u0646\u064A\u0627 \u0628\u0627\u0644\u062F\u062C\u0627\u062C\u060C \u0641\u0637\u0631 \u0637\u0627\u0632\u062C\u060C \u0635\u0644\u0635\u0629 \u0628\u064A\u0636\u0627\u0621\u060C \u0628\u064A\u0634\u0627\u0645\u064A\u0644\u060C \u0648\u062C\u0628\u0646 \u0645\u062D\u0645\u0631 \u0641\u064A \u0627\u0644\u0641\u0631\u0646."
          },
          "price": "60",
          "image": "images/lasagne-poulet.webp",
          "isNew": true
        },
        {
          "name": {
            "fr": "LASAGNE BOLOGNAISE ",
            "en": "Bolognese lasagne.",
            "de": "Bolognese lasagne ",
            "ar": "\u0644\u0627\u0632\u0627\u0646\u064A\u0627 \u0628\u0648\u0644\u0648\u0646\u064A\u0632 \u0628\u0627\u0644\u0644\u062D\u0645 \u0627\u0644\u0645\u0641\u0631\u0648\u0645"
          },
          "description": {
            "fr": "Viande hach\xE9e, P\xE2tes lasagne, Sauce bolognaise, B\xE9chamel, fromage",
            "en": "Ground beef, lasagne pasta, Bolognese sauce, b\xE9chamel, cheese.",
            "de": "Hackfleisch, Lasagne-Nudeln, Bolognese-Sauce, B\xE9chamelsauce, K\xE4se.",
            "ar": "\u0637\u0628\u0642\u0627\u062A \u0644\u0627\u0632\u0627\u0646\u064A\u0627 \u0628\u0627\u0644\u0644\u062D\u0645 \u0627\u0644\u0645\u0641\u0631\u0648\u0645\u060C \u0635\u0644\u0635\u0629 \u0628\u0648\u0644\u0648\u0646\u064A\u0632\u060C \u0628\u064A\u0634\u0627\u0645\u064A\u0644\u060C \u0648\u062C\u0628\u0646 \u063A\u0646\u064A \u0645\u062D\u0645\u0631 \u0641\u064A \u0627\u0644\u0641\u0631\u0646."
          },
          "price": "72",
          "image": "images/lasagne-viande.webp",
          "isNew": true
        }
      ]
    },
    {
      "category": {
        "fr": "CR\xCAPES et GAUFRES",
        "en": "CR\xCAPES and WAFFLES",
        "de": "CR\xCAPES und WAFFELN",
        "ar": "\u0643\u0631\u064A\u0628 \u0648 \u0648\u0627\u0641\u0644 \u062D\u0644\u0648"
      },
      "id": "crepes",
      "items": [
        {
          "name": {
            "fr": "KUNAFA PISTACHE",
            "en": "PISTACHIO KUNAFA",
            "de": "PISTAZIEN KUNAFA",
            "ar": "\u0643\u0631\u064A\u0628 \u0623\u0648 \u0648\u0627\u0641\u0644 \u0643\u0646\u0627\u0641\u0629 \u0628\u0627\u0644\u0641\u0633\u062A\u0642"
          },
          "description": {
            "fr": "Cr\xEApe ou gaufre saveur Kunafa pistache.",
            "en": "Cr\xEApe or waffle with Kunafa pistachio flavor.",
            "de": "Cr\xEApe oder Waffel mit Kunafa Pistazien-Geschmack.",
            "ar": "\u0643\u0631\u064A\u0628 \u0623\u0648 \u0648\u0627\u0641\u0644 \u0645\u0645\u064A\u0632 \u0628\u0646\u0643\u0647\u0629 \u0627\u0644\u0643\u0646\u0627\u0641\u0629 \u0627\u0644\u0645\u0642\u0631\u0645\u0634\u0629 \u0645\u0639 \u0627\u0644\u0641\u0633\u062A\u0642 \u0627\u0644\u062D\u0644\u0628\u064A \u0627\u0644\u063A\u0646\u064A."
          },
          "price": "48",
          "image": "images/crepe-kunafa.webp"
        },
        {
          "name": {
            "fr": "BANANE-NUTELLA",
            "en": "BANANA-NUTELLA",
            "de": "BANANE-NUTELLA",
            "ar": "\u0643\u0631\u064A\u0628 \u0623\u0648 \u0648\u0627\u0641\u0644 \u0645\u0648\u0632 \u0648\u0646\u0648\u062A\u064A\u0644\u0627"
          },
          "description": {
            "fr": "Cr\xEApe ou gaufre \xE0 la banane et Nutella.",
            "en": "Cr\xEApe or waffle with banana and Nutella.",
            "de": "Cr\xEApe oder Waffel mit Banane und Nutella.",
            "ar": "\u0643\u0631\u064A\u0628 \u0623\u0648 \u0648\u0627\u0641\u0644 \u0645\u062D\u0634\u0648 \u0628\u0634\u0631\u0627\u0626\u062D \u0627\u0644\u0645\u0648\u0632 \u0627\u0644\u0637\u0627\u0632\u062C \u0648\u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629 \u0646\u0648\u062A\u064A\u0644\u0627 \u0627\u0644\u0623\u0635\u0644\u064A\u0629."
          },
          "price": "42",
          "image": "images/crepe-bananenutella.webp"
        },
        {
          "name": {
            "fr": "NUTELLA",
            "en": "NUTELLA",
            "de": "NUTELLA",
            "ar": "\u0643\u0631\u064A\u0628 \u0623\u0648 \u0648\u0627\u0641\u0644 \u0646\u0648\u062A\u064A\u0644\u0627 \u0643\u0644\u0627\u0633\u064A\u0643"
          },
          "description": {
            "fr": "Cr\xEApe ou gaufre au Nutella.",
            "en": "Cr\xEApe or waffle with Nutella.",
            "de": "Cr\xEApe oder Waffel mit Nutella.",
            "ar": "\u0643\u0631\u064A\u0628 \u0623\u0648 \u0648\u0627\u0641\u0644 \u0645\u0639 \u0637\u0628\u0642\u0629 \u0648\u0641\u064A\u0631\u0629 \u0645\u0646 \u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629 \u0646\u0648\u062A\u064A\u0644\u0627 \u0627\u0644\u0644\u0630\u064A\u0630\u0629."
          },
          "price": "38",
          "image": "images/crepe-nutella.webp"
        }
      ]
    },
    {
      "category": {
        "fr": "CR\xCAPES SAL\xC9ES",
        "en": "SAVORY CR\xCAPES",
        "de": "HERZHAFTE CR\xCAPES",
        "ar": "\u0643\u0631\u064A\u0628 \u0645\u0627\u0644\u062D"
      },
      "items": [
        {
          "name": {
            "fr": "Cr\xEApe P\xCACHEUR",
            "en": "FISHERMAN'S Cr\xEApe",
            "de": "FISCHER Cr\xEApe",
            "ar": "\u0643\u0631\u064A\u0628 \u0645\u0627\u0644\u062D \u0641\u0648\u0627\u0643\u0647 \u0627\u0644\u0628\u062D\u0631 (\u0628\u064A\u0634\u0648\u0631)"
          },
          "description": {
            "fr": "Cr\xEApe sal\xE9e aux fruits de mer.",
            "en": "Savory cr\xEApe with seafood.",
            "de": "Herzhafter Cr\xEApe mit Meeresfr\xFCchten.",
            "ar": "\u0643\u0631\u064A\u0628 \u0645\u0627\u0644\u062D \u0645\u062D\u0634\u0648 \u0628\u0627\u0644\u062C\u0645\u0628\u0631\u064A \u0648\u0627\u0644\u0643\u0644\u0645\u0627\u0631 \u0648\u0641\u0648\u0627\u0643\u0647 \u0627\u0644\u0628\u062D\u0631 \u0648\u0627\u0644\u0635\u0644\u0635\u0629 \u0627\u0644\u0628\u064A\u0636\u0627\u0621 \u0648\u0627\u0644\u062C\u0628\u0646."
          },
          "price": "58",
          "image": "images/crepe-sal-pecheur.webp"
        },
        {
          "name": {
            "fr": "Cr\xEApe GREY CORNER (MIXTE)",
            "en": "GREY CORNER Cr\xEApe (MIXED)",
            "de": "GREY CORNER Cr\xEApe (GEMISCHT)",
            "ar": "\u0643\u0631\u064A\u0628 \u063A\u0631\u064A \u0643\u0648\u0631\u0646\u0631 \u0645\u0627\u0644\u062D \u0645\u0634\u0643\u0644"
          },
          "description": {
            "fr": "Cr\xEApe sal\xE9e mixte (viande et fromage).",
            "en": "Mixed savory cr\xEApe (meat and cheese).",
            "de": "Gemischter herzhafter Cr\xEApe (Fleisch und K\xE4se).",
            "ar": "\u0643\u0631\u064A\u0628 \u0645\u0627\u0644\u062D \u0645\u0634\u0643\u0644 \u064A\u062C\u0645\u0639 \u0628\u064A\u0646 \u0627\u0644\u0644\u062D\u0645 \u0648\u0627\u0644\u062F\u062C\u0627\u062C \u0648\u0627\u0644\u062C\u0628\u0646 \u0627\u0644\u0630\u0627\u0626\u0628."
          },
          "price": "58",
          "image": "images/crepe-sal-gc.webp"
        },
        {
          "name": {
            "fr": "Cr\xEApe POULET-CHAMPIGNON",
            "en": "CHICKEN-MUSHROOM Cr\xEApe",
            "de": "H\xC4HNCHEN-PILZ Cr\xEApe",
            "ar": "\u0643\u0631\u064A\u0628 \u0645\u0627\u0644\u062D \u062F\u062C\u0627\u062C \u0628\u0627\u0644\u0641\u0637\u0631"
          },
          "description": {
            "fr": "Cr\xEApe sal\xE9e au poulet et champignons.",
            "en": "Savory cr\xEApe with chicken and mushrooms.",
            "de": "Herzhafter Cr\xEApe mit H\xE4hnchen und Pilzen.",
            "ar": "\u0643\u0631\u064A\u0628 \u0645\u0627\u0644\u062D \u0645\u062D\u0634\u0648 \u0628\u0642\u0637\u0639 \u0627\u0644\u062F\u062C\u0627\u062C \u0648\u0627\u0644\u0641\u0637\u0631 \u0648\u0627\u0644\u0635\u0644\u0635\u0629 \u0627\u0644\u0643\u0631\u064A\u0645\u064A\u0629 \u0648\u062C\u0628\u0646 \u0627\u0644\u0645\u0648\u0632\u0627\u0631\u064A\u0644\u0627."
          },
          "price": "48",
          "image": "images/crepe-sal-poulet.webp"
        },
        {
          "name": {
            "fr": "Cr\xEApe CHARCUTERIE",
            "en": "COLD CUTS Cr\xEApe",
            "de": "AUFSCHNITT Cr\xEApe",
            "ar": "\u0643\u0631\u064A\u0628 \u0645\u0627\u0644\u062D \u0628\u0627\u0644\u0634\u0627\u0631\u0643\u0648\u062A\u0631\u064A"
          },
          "description": {
            "fr": "Cr\xEApe sal\xE9e \xE0 la charcuterie.",
            "en": "Savory cr\xEApe with cold cuts.",
            "de": "Herzhafter Cr\xEApe mit Aufschnitt.",
            "ar": "\u0643\u0631\u064A\u0628 \u0645\u0627\u0644\u062D \u0645\u062D\u0634\u0648 \u0628\u0627\u0644\u0634\u0627\u0631\u0643\u0648\u062A\u0631\u064A \u0648\u0627\u0644\u062C\u0628\u0646 \u0627\u0644\u0630\u0627\u0626\u0628 \u0648\u0627\u0644\u0635\u0644\u0635\u0629."
          },
          "price": "45",
          "image": "images/crepe-sal-charcut.webp"
        }
      ]
    },
    {
      "category": {
        "fr": "G\xC2TEAUX",
        "en": "DESSERTS / CAKES",
        "de": "KUCHEN / DESSERTS",
        "ar": "\u0627\u0644\u062D\u0644\u0648\u064A\u0627\u062A \u0648 \u0627\u0644\u0643\u064A\u0643"
      },
      "id": "gateaux",
      "items": [
        {
          "name": {
            "fr": "SAN SEBASTIEN",
            "en": "SAN SEBASTIEN",
            "de": "SAN SEBASTIEN",
            "ar": "\u062A\u0634\u064A\u0632 \u0643\u064A\u0643 \u0633\u0627\u0646 \u0633\u064A\u0628\u0627\u0633\u062A\u064A\u0627\u0646 \u0627\u0644\u0625\u0633\u0628\u0627\u0646\u064A"
          },
          "description": {
            "fr": "Parfums : fruits rouge, caramel, pistache, chocolat noir, miel.",
            "en": "Flavors: red fruits, caramel, pistachio, dark chocolate, honey.",
            "de": "Geschmacksrichtungen: rote Fr\xFCchte, Karamell, Pistazie, dunkle Schokolade, Honig.",
            "ar": "\u0646\u0643\u0647\u0627\u062A \u062D\u0633\u0628 \u0627\u0644\u0627\u062E\u062A\u064A\u0627\u0631: \u0641\u0648\u0627\u0643\u0647 \u062D\u0645\u0631\u0627\u0621\u060C \u0643\u0631\u0627\u0645\u064A\u0644\u060C \u0641\u0633\u062A\u0642\u060C \u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629 \u0633\u0648\u062F\u0627\u0621\u060C \u0623\u0648 \u0639\u0633\u0644."
          },
          "price": "45",
          "image": "images/gateau-sanseb-vari.webp"
        },
        {
          "name": {
            "fr": "CHEESECAKE (Chocolat, Pistache, Framboise)",
            "en": "CHEESECAKE (Chocolate, Pistachio, Raspberry)",
            "de": "CHEESECAKE (Schokolade, Pistazie, Himbeere)",
            "ar": "\u062A\u0634\u064A\u0632 \u0643\u064A\u0643 \u0628\u0627\u0631\u062F (\u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629\u060C \u0641\u0633\u062A\u0642\u060C \u0623\u0648 \u062A\u0648\u062A)"
          },
          "description": {
            "fr": "Cheesecake gourmand aux parfums chocolat, pistache et framboise.",
            "en": "Delicious cheesecake with chocolate, pistachio and raspberry flavors.",
            "de": "Leckerer K\xE4sekuchen mit Schokolade-, Pistazien- und Himbeergeschmack.",
            "ar": "\u062A\u0634\u064A\u0632 \u0643\u064A\u0643 \u0643\u0631\u064A\u0645\u064A \u0641\u0627\u062E\u0631 \u0628\u0646\u0643\u0647\u0627\u062A \u0627\u0644\u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629 \u0623\u0648 \u0627\u0644\u0641\u0633\u062A\u0642 \u0623\u0648 \u062A\u0648\u062A \u0627\u0644\u0639\u0644\u064A\u0642."
          },
          "price": "45",
          "image": "images/gateau-cheesecake-choco.webp"
        },
        {
          "name": {
            "fr": "FONDANT AU CHOCOLAT",
            "en": "CHOCOLATE FONDANT",
            "de": "SCHOKOLADEN-FONDANT",
            "ar": "\u0641\u0648\u0646\u062F\u0627\u0646 \u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629 \u0633\u0627\u062E\u0646 \u0645\u0639 \u0622\u064A\u0633 \u0643\u0631\u064A\u0645"
          },
          "description": {
            "fr": "Servi avec boule vanille.",
            "en": "Served with vanilla scoop.",
            "de": "Serviert mit Vanillekugel.",
            "ar": "\u0643\u064A\u0643 \u0641\u0648\u0646\u062F\u0627\u0646 \u062F\u0627\u0641\u0626 \u0628\u0642\u0644\u0628 \u0627\u0644\u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629 \u0627\u0644\u0630\u0627\u0626\u0628\u0629\u060C \u064A\u0642\u062F\u0645 \u0645\u0639 \u0643\u0631\u0629 \u0622\u064A\u0633 \u0643\u0631\u064A\u0645 \u0641\u0627\u0646\u064A\u0644\u064A\u0627."
          },
          "price": "40",
          "image": "images/gateau-fondant.webp"
        },
        {
          "name": {
            "fr": "SAN SEBASTIEN (Nutella)",
            "en": "SAN SEBASTIEN (Nutella)",
            "de": "SAN SEBASTIEN (Nutella)",
            "ar": "\u062A\u0634\u064A\u0632 \u0643\u064A\u0643 \u0633\u0627\u0646 \u0633\u064A\u0628\u0627\u0633\u062A\u064A\u0627\u0646 \u0628\u0646\u0648\u062A\u064A\u0644\u0627"
          },
          "description": {
            "fr": "Cheesecake basque au Nutella.",
            "en": "Basque cheesecake with Nutella.",
            "de": "Baskischer K\xE4sekuchen mit Nutella.",
            "ar": "\u062A\u0634\u064A\u0632 \u0643\u064A\u0643 \u0628\u0627\u0633\u0643\u064A \u0645\u062E\u0628\u0648\u0632 \u0645\u063A\u0637\u0649 \u0628\u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629 \u0646\u0648\u062A\u064A\u0644\u0627 \u0627\u0644\u0623\u0635\u0644\u064A\u0629."
          },
          "price": "40",
          "image": "images/gateau-sanseb-nutella.webp"
        }
      ]
    },
    {
      "category": {
        "fr": "BOISSONS CHAUDES",
        "en": "HOT DRINKS",
        "de": "HEISSE GETR\xC4NKE",
        "ar": "\u0645\u0634\u0631\u0648\u0628\u0627\u062A \u0633\u0627\u062E\u0646\u0629"
      },
      "items": [
        {
          "name": {
            "fr": "CHOCOLAT FONDUE",
            "en": "CHOCOLATE FONDUE",
            "de": "SCHOKOLADEN-FONDUE",
            "ar": "\u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629 \u0641\u0648\u0646\u062F\u0648 \u0633\u0627\u062E\u0646\u0629 \u063A\u0646\u064A\u0629"
          },
          "description": {
            "fr": "Chocolat fondu riche.",
            "en": "Rich melted chocolate.",
            "de": "Reiche geschmolzene Schokolade.",
            "ar": "\u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629 \u0633\u0627\u062E\u0646\u0629 \u063A\u0646\u064A\u0629 \u0648\u0645\u0630\u0627\u0628\u0629 \u0628\u0642\u0648\u0627\u0645 \u0643\u0631\u064A\u0645\u064A \u0641\u0627\u062E\u0631."
          },
          "price": "26",
          "image": "images/boisson-choc-fondue.webp"
        },
        {
          "name": {
            "fr": "CAF\xC9 NESPRESSO",
            "en": "NESPRESSO COFFEE",
            "de": "NESPRESSO KAFFEE",
            "ar": "\u0642\u0647\u0648\u0629 \u0646\u0633\u0628\u0631\u064A\u0633\u0648 \u0628\u0631\u064A\u0645\u064A\u0648\u0645"
          },
          "description": {
            "fr": "Servi avec une eau min\xE9rale 33 cl.",
            "en": "Served with a 33 cl mineral water.",
            "de": "Serviert mit einem 33 cl Mineralwasser.",
            "ar": "\u0642\u0647\u0648\u0629 \u0646\u0633\u0628\u0631\u064A\u0633\u0648 \u0641\u0627\u062E\u0631\u0629\u060C \u062A\u0642\u062F\u0645 \u0645\u0639 \u0642\u0646\u064A\u0646\u0629 \u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A 33 \u0633\u0646\u062A\u0644\u062A\u0631."
          },
          "price": "22",
          "image": "images/boisson-nespresso.webp"
        },
        {
          "name": {
            "fr": "CAPPUCHINO AVEC CHANTILLY",
            "en": "CAPPUCCINO WITH WHIPPED CREAM",
            "de": "CAPPUCCINO MIT SCHLAGSAHNE",
            "ar": "\u0643\u0627\u0628\u062A\u0634\u064A\u0646\u0648 \u0645\u0639 \u0643\u0631\u064A\u0645\u0629 \u0627\u0644\u0634\u0627\u0646\u062A\u064A\u064A"
          },
          "description": {
            "fr": "Servi avec une eau min\xE9rale 33 cl.",
            "en": "Served with a 33 cl mineral water.",
            "de": "Serviert mit einem 33 cl Mineralwasser.",
            "ar": "\u0643\u0627\u0628\u062A\u0634\u064A\u0646\u0648 \u063A\u0646\u064A \u0645\u0639 \u0643\u0631\u064A\u0645\u0629 \u0627\u0644\u0634\u0627\u0646\u062A\u064A\u064A \u0627\u0644\u0645\u062E\u0641\u0648\u0642\u0629\u060C \u064A\u0642\u062F\u0645 \u0645\u0639 \u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A 33 \u0633\u0646\u062A\u0644\u062A\u0631."
          },
          "price": "22",
          "image": "images/boisson-cappu-chant.webp"
        },
        {
          "name": {
            "fr": "CHOCOLAT AVEC CHANTILLY",
            "en": "CHOCOLATE WITH WHIPPED CREAM",
            "de": "SCHOKOLADE MIT SCHLAGSAHNE",
            "ar": "\u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629 \u0633\u0627\u062E\u0646\u0629 \u0645\u0639 \u0634\u0627\u0646\u062A\u064A\u064A"
          },
          "description": {
            "fr": "Servi avec une eau min\xE9rale 33 cl.",
            "en": "Served with a 33 cl mineral water.",
            "de": "Serviert mit einem 33 cl Mineralwasser.",
            "ar": "\u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629 \u0633\u0627\u062E\u0646\u0629 \u0645\u0639 \u0643\u0631\u064A\u0645\u0629 \u0627\u0644\u0634\u0627\u0646\u062A\u064A\u064A\u060C \u062A\u0642\u062F\u0645 \u0645\u0639 \u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A 33 \u0633\u0646\u062A\u0644\u062A\u0631."
          },
          "price": "22",
          "image": "images/boisson-choc-chant.webp"
        },
        {
          "name": {
            "fr": "CAF\xC9 AU LAIT",
            "en": "COFFEE WITH MILK",
            "de": "KAFFEE MIT MILCH",
            "ar": "\u0642\u0647\u0648\u0629 \u0628\u0627\u0644\u062D\u0644\u064A\u0628"
          },
          "description": {
            "fr": "Servi avec une eau min\xE9rale 33 cl.",
            "en": "Served with a 33 cl mineral water.",
            "de": "Serviert mit einem 33 cl Mineralwasser.",
            "ar": "\u0642\u0647\u0648\u0629 \u0628\u0627\u0644\u062D\u0644\u064A\u0628 \u0645\u062A\u0648\u0627\u0632\u0646\u0629 \u0648\u063A\u0646\u064A\u0629\u060C \u062A\u0642\u062F\u0645 \u0645\u0639 \u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A 33 \u0633\u0646\u062A\u0644\u062A\u0631."
          },
          "price": "19",
          "image": "images/boisson-cafelait.webp"
        },
        {
          "name": {
            "fr": "CAPPUCHINO ITALIEN",
            "en": "ITALIAN CAPPUCCINO",
            "de": "ITALIENISCHER CAPPUCCINO",
            "ar": "\u0643\u0627\u0628\u062A\u0634\u064A\u0646\u0648 \u0625\u064A\u0637\u0627\u0644\u064A"
          },
          "description": {
            "fr": "Servi avec une eau min\xE9rale 33 cl.",
            "en": "Served with a 33 cl mineral water.",
            "de": "Serviert mit einem 33 cl Mineralwasser.",
            "ar": "\u0643\u0627\u0628\u062A\u0634\u064A\u0646\u0648 \u0625\u064A\u0637\u0627\u0644\u064A \u0643\u0644\u0627\u0633\u064A\u0643\u064A \u0628\u0631\u063A\u0648\u0629 \u0627\u0644\u062D\u0644\u064A\u0628 \u0627\u0644\u063A\u0646\u064A\u0629\u060C \u064A\u0642\u062F\u0645 \u0645\u0639 \u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A 33 \u0633\u0646\u062A\u0644\u062A\u0631."
          },
          "price": "19",
          "image": "images/boisson-cappu.webp"
        },
        {
          "name": {
            "fr": "CHOCOLAT AU LAIT",
            "en": "HOT CHOCOLATE",
            "de": "HEISSE SCHOKOLADE",
            "ar": "\u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629 \u0628\u0627\u0644\u062D\u0644\u064A\u0628"
          },
          "description": {
            "fr": "Servi avec une eau min\xE9rale 33 cl.",
            "en": "Served with a 33 cl mineral water.",
            "de": "Serviert mit einem 33 cl Mineralwasser.",
            "ar": "\u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629 \u0633\u0627\u062E\u0646\u0629 \u0628\u0627\u0644\u062D\u0644\u064A\u0628 \u0627\u0644\u0643\u0631\u064A\u0645\u064A \u0627\u0644\u0644\u0630\u064A\u0630\u060C \u062A\u0642\u062F\u0645 \u0645\u0639 \u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A 33 \u0633\u0646\u062A\u0644\u062A\u0631."
          },
          "price": "18",
          "image": "images/boisson-chocolat.webp"
        },
        {
          "name": {
            "fr": "CAF\xC9 LATTE",
            "en": "CAFE LATTE",
            "de": "CAF\xC9 LATTE",
            "ar": "\u0643\u0627\u0641\u064A\u0647 \u0644\u0627\u062A\u064A\u0647"
          },
          "description": {
            "fr": "Servi avec une eau min\xE9rale 33 cl.",
            "en": "Served with a 33 cl mineral water.",
            "de": "Serviert mit einem 33 cl Mineralwasser.",
            "ar": "\u0643\u0627\u0641\u064A\u0647 \u0644\u0627\u062A\u064A\u0647 \u0628\u062D\u0644\u064A\u0628 \u0645\u0628\u062E\u0631 \u0646\u0627\u0639\u0645 \u0648\u0637\u0628\u0642\u0629 \u0631\u063A\u0648\u0629 \u062E\u0641\u064A\u0641\u0629\u060C \u064A\u0642\u062F\u0645 \u0645\u0639 \u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A 33 \u0633\u0646\u062A\u0644\u062A\u0631."
          },
          "price": "19",
          "image": "images/boisson-cafelatte.webp"
        },
        {
          "name": {
            "fr": "TH\xC9 NOIR AU LAIT",
            "en": "BLACK TEA WITH MILK",
            "de": "SCHWARZER TEE MIT MILCH",
            "ar": "\u0634\u0627\u064A \u0623\u0633\u0648\u062F \u0628\u0627\u0644\u062D\u0644\u064A\u0628 (\u0643\u0631\u0643)"
          },
          "description": {
            "fr": "Th\xE9 noir servi avec du lait.",
            "en": "Black tea served with milk.",
            "de": "Schwarzer Tee serviert mit Milch.",
            "ar": "\u0634\u0627\u064A \u0623\u0633\u0648\u062F \u0645\u063A\u0644\u0649 \u064A\u0642\u062F\u0645 \u0645\u0639 \u0627\u0644\u062D\u0644\u064A\u0628 \u0627\u0644\u0633\u0627\u062E\u0646."
          },
          "price": "18",
          "image": "images/boisson-thenoir-lait.webp"
        },
        {
          "name": {
            "fr": "TH\xC9 INFUSION",
            "en": "INFUSION TEA",
            "de": "KR\xC4UTERTEE",
            "ar": "\u0645\u0646\u0642\u0648\u0639 \u0623\u0639\u0634\u0627\u0628 \u0637\u0628\u064A\u0639\u064A"
          },
          "description": {
            "fr": "S\xE9lection d'infusions.",
            "en": "Selection of infusions.",
            "de": "Auswahl an Kr\xE4utertees.",
            "ar": "\u062A\u0634\u0643\u064A\u0644\u0629 \u0645\u062E\u062A\u0627\u0631\u0629 \u0645\u0646 \u0627\u0644\u0623\u0639\u0634\u0627\u0628 \u0627\u0644\u0637\u0628\u064A\u0639\u064A\u0629 \u0627\u0644\u0645\u0646\u0642\u0648\u0639\u0629 \u0648\u0627\u0644\u0645\u0631\u064A\u062D\u0629."
          },
          "price": "18",
          "image": "images/boisson-infusion.webp"
        },
        {
          "name": {
            "fr": "CAF\xC9 AMERICAIN",
            "en": "AMERICAN COFFEE",
            "de": "AMERICANO",
            "ar": "\u0642\u0647\u0648\u0629 \u0623\u0645\u0631\u064A\u0643\u0627\u0646\u0648"
          },
          "description": {
            "fr": "Servi avec une eau min\xE9rale 33 cl.",
            "en": "Served with a 33 cl mineral water.",
            "de": "Serviert mit einem 33 cl Mineralwasser.",
            "ar": "\u0642\u0647\u0648\u0629 \u0623\u0645\u0631\u064A\u0643\u0627\u0646\u0648 \u062E\u0641\u064A\u0641\u0629 \u0648\u0645\u0642\u0637\u0631\u0629\u060C \u062A\u0642\u062F\u0645 \u0645\u0639 \u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A 33 \u0633\u0646\u062A\u0644\u062A\u0631."
          },
          "price": "17",
          "image": "images/boisson-americano.webp"
        },
        {
          "name": {
            "fr": "CAF\xC9 NOIR",
            "en": "BLACK COFFEE",
            "de": "SCHWARZER KAFFEE",
            "ar": "\u0642\u0647\u0648\u0629 \u0633\u0648\u062F\u0627\u0621 (\u0625\u0633\u0628\u0631\u064A\u0633\u0648)"
          },
          "description": {
            "fr": "Servi avec une eau min\xE9rale 33 cl.",
            "en": "Served with a 33 cl mineral water.",
            "de": "Serviert mit einem 33 cl Mineralwasser.",
            "ar": "\u0642\u0647\u0648\u0629 \u0633\u0648\u062F\u0627\u0621 \u0645\u0631\u0643\u0632\u0629 \u0648\u0646\u0642\u064A\u0629 \u0628\u0631\u0627\u0626\u062D\u0629 \u063A\u0646\u064A\u0629\u060C \u062A\u0642\u062F\u0645 \u0645\u0639 \u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A 33 \u0633\u0646\u062A\u0644\u062A\u0631."
          },
          "price": "16",
          "image": "images/boisson-cafe.webp"
        },
        {
          "name": {
            "fr": "TH\xC9 \xC0 LA MENTHE",
            "en": "MINT TEA",
            "de": "MINZTEE",
            "ar": "\u0634\u0627\u064A \u0645\u063A\u0631\u0628\u064A \u0623\u0635\u064A\u0644 \u0628\u0627\u0644\u0646\u0639\u0646\u0627\u0639"
          },
          "description": {
            "fr": "Th\xE9 traditionnel \xE0 la menthe.",
            "en": "Traditional mint tea.",
            "de": "Traditioneller Minztee.",
            "ar": "\u0634\u0627\u064A \u0645\u063A\u0631\u0628\u064A \u062A\u0642\u0644\u064A\u062F\u064A \u0645\u062D\u0636\u0631 \u0628\u0627\u0644\u0646\u0639\u0646\u0627\u0639 \u0627\u0644\u0637\u0627\u0632\u062C \u0627\u0644\u0645\u0646\u0639\u0634."
          },
          "price": "16",
          "image": "images/boisson-the.webp"
        },
        {
          "name": {
            "fr": "TH\xC9 NOIR",
            "en": "BLACK TEA",
            "de": "SCHWARZER TEE",
            "ar": "\u0634\u0627\u064A \u0623\u0633\u0648\u062F \u0633\u064A\u0644\u0627\u0646\u064A"
          },
          "description": {
            "fr": "Th\xE9 noir nature.",
            "en": "Plain black tea.",
            "de": "Purer schwarzer Tee.",
            "ar": "\u0634\u0627\u064A \u0623\u0633\u0648\u062F \u0637\u0628\u064A\u0639\u064A \u0643\u0644\u0627\u0633\u064A\u0643\u064A \u0648\u062F\u0627\u0641\u0626."
          },
          "price": "15",
          "image": "images/boisson-thenoir.webp"
        },
        {
          "name": {
            "fr": "VERVEINE",
            "en": "VERBENA",
            "de": "VERBENA",
            "ar": "\u0644\u0648\u064A\u0632\u0629 \u0645\u063A\u0631\u0628\u064A\u0629 \u0637\u0628\u064A\u0639\u064A\u0629"
          },
          "description": {
            "fr": "Infusion de verveine.",
            "en": "Verbena infusion.",
            "de": "Eisenkraut-Aufguss.",
            "ar": "\u0645\u0646\u0642\u0648\u0639 \u0646\u0628\u0627\u062A \u0627\u0644\u0644\u0648\u064A\u0632\u0629 \u0627\u0644\u0637\u0628\u064A\u0639\u064A\u0629 \u0627\u0644\u0645\u0647\u062F\u0626\u0629 \u0644\u0644\u0623\u0639\u0635\u0627\u0628."
          },
          "price": "15",
          "image": "images/boisson-verveine.webp"
        },
        {
          "name": {
            "fr": "LAIT FROID / CHAUD",
            "en": "COLD / HOT MILK",
            "de": "KALTE / WARME MILCH",
            "ar": "\u062D\u0644\u064A\u0628 \u0637\u0627\u0632\u062C (\u0628\u0627\u0631\u062F \u0623\u0648 \u0633\u0627\u062E\u0646)"
          },
          "description": {
            "fr": "Lait nature.",
            "en": "Plain milk.",
            "de": "Normale Milch.",
            "ar": "\u062D\u0644\u064A\u0628 \u0637\u0628\u064A\u0639\u064A \u0637\u0627\u0632\u062C \u064A\u0642\u062F\u0645 \u0628\u0627\u0631\u062F\u0627\u064B \u0623\u0648 \u0633\u0627\u062E\u0646\u0627\u064B \u062D\u0633\u0628 \u0631\u063A\u0628\u062A\u0643."
          },
          "price": "12",
          "image": "images/boisson-lait.webp"
        }
      ]
    },
    {
      "category": {
        "fr": "SODA",
        "en": "SODA",
        "de": "SODA",
        "ar": "\u0645\u0634\u0631\u0648\u0628\u0627\u062A \u063A\u0627\u0632\u064A\u0629"
      },
      "items": [
        {
          "name": {
            "fr": "REDBULL",
            "en": "REDBULL",
            "de": "REDBULL",
            "ar": "\u0645\u0634\u0631\u0648\u0628 \u0627\u0644\u0637\u0627\u0642\u0629 \u0631\u064A\u062F \u0628\u0648\u0644"
          },
          "description": {
            "fr": "Boisson \xE9nergisante.",
            "en": "Energy drink.",
            "de": "Energy-Drink.",
            "ar": "\u0645\u0634\u0631\u0648\u0628 \u0637\u0627\u0642\u0629 \u0645\u0646\u0639\u0634 \u0648\u062D\u064A\u0648\u064A \u064A\u0642\u062F\u0645 \u0628\u0627\u0631\u062F\u0627\u064B."
          },
          "price": "28",
          "image": "images/soda-redbull.webp"
        },
        {
          "name": {
            "fr": "COCA",
            "en": "COKE",
            "de": "COCA",
            "ar": "\u0643\u0648\u0643\u0627\u0643\u0648\u0644\u0627 \u0643\u0644\u0627\u0633\u064A\u0643"
          },
          "description": {
            "fr": "Boisson gazeuse.",
            "en": "Fizzy drink.",
            "de": "Sprudelgetr\xE4nk.",
            "ar": "\u0645\u0634\u0631\u0648\u0628 \u063A\u0627\u0632\u064A \u0643\u0644\u0627\u0633\u064A\u0643\u064A \u0645\u0646\u0639\u0634 \u0648\u0645\u062B\u0644\u062C."
          },
          "price": "17",
          "image": "images/soda-coca.webp"
        },
        {
          "name": {
            "fr": "COCA ZERO",
            "en": "COKE ZERO",
            "de": "COCA ZERO",
            "ar": "\u0643\u0648\u0643\u0627\u0643\u0648\u0644\u0627 \u0632\u064A\u0631\u0648 \u0633\u0643\u0631"
          },
          "description": {
            "fr": "Boisson gazeuse sans sucre.",
            "en": "Sugar-free fizzy drink.",
            "de": "Zuckerfreies Sprudelgetr\xE4nk.",
            "ar": "\u0645\u0634\u0631\u0648\u0628 \u063A\u0627\u0632\u064A \u0643\u0648\u0643\u0627\u0643\u0648\u0644\u0627 \u0645\u0646\u0639\u0634 \u0628\u062F\u0648\u0646 \u0633\u0643\u0631 \u0648\u0628\u062F\u0648\u0646 \u0633\u0639\u0631\u0627\u062A \u062D\u0631\u0627\u0631\u064A\u0629."
          },
          "price": "17",
          "image": "images/soda-cocazero.webp"
        },
        {
          "name": {
            "fr": "SPRITE",
            "en": "SPRITE",
            "de": "SPRITE",
            "ar": "\u0633\u0628\u0631\u0627\u064A\u062A \u0644\u064A\u0645\u0648\u0646"
          },
          "description": {
            "fr": "Boisson gazeuse.",
            "en": "Fizzy drink.",
            "de": "Sprudelgetr\xE4nk.",
            "ar": "\u0645\u0634\u0631\u0648\u0628 \u063A\u0627\u0632\u064A \u0628\u0646\u0643\u0647\u0629 \u0627\u0644\u0644\u064A\u0645\u0648\u0646 \u0627\u0644\u062D\u0627\u0645\u0636 \u0627\u0644\u0645\u0646\u0639\u0634."
          },
          "price": "17",
          "image": "images/soda-sprite.webp"
        },
        {
          "name": {
            "fr": "HAWAI",
            "en": "HAWAI",
            "de": "HAWAI",
            "ar": "\u0647\u0627\u0648\u0627\u064A \u0627\u0633\u062A\u0648\u0627\u0626\u064A"
          },
          "description": {
            "fr": "Boisson gazeuse.",
            "en": "Fizzy drink.",
            "de": "Sprudelgetr\xE4nk.",
            "ar": "\u0645\u0634\u0631\u0648\u0628 \u063A\u0627\u0632\u064A \u0628\u0646\u0643\u0647\u0629 \u0627\u0644\u0641\u0648\u0627\u0643\u0647 \u0627\u0644\u0627\u0633\u062A\u0648\u0627\u0626\u064A\u0629 \u0627\u0644\u0645\u0646\u0639\u0634\u0629."
          },
          "price": "17",
          "image": "images/soda-hawai.webp"
        },
        {
          "name": {
            "fr": "POMS",
            "en": "POMS",
            "de": "POMS",
            "ar": "\u0628\u0648\u0645\u0633 \u0628\u0646\u0643\u0647\u0629 \u0627\u0644\u062A\u0641\u0627\u062D"
          },
          "description": {
            "fr": "Boisson gazeuse.",
            "en": "Fizzy drink.",
            "de": "Sprudelgetr\xE4nk.",
            "ar": "\u0645\u0634\u0631\u0648\u0628 \u063A\u0627\u0632\u064A \u0645\u063A\u0631\u0628\u064A \u0634\u0647\u064A\u0631 \u0628\u0646\u0643\u0647\u0629 \u0627\u0644\u062A\u0641\u0627\u062D \u0627\u0644\u0623\u062E\u0636\u0631 \u0627\u0644\u0644\u0630\u064A\u0630."
          },
          "price": "17",
          "image": "images/soda-poms.webp"
        },
        {
          "name": {
            "fr": "ORANGINA",
            "en": "ORANGINA",
            "de": "ORANGINA",
            "ar": "\u0623\u0648\u0631\u0627\u0646\u062C\u064A\u0646\u0627 \u0628\u0627\u0644\u0644\u0628 \u0627\u0644\u0637\u0628\u064A\u0639\u064A"
          },
          "description": {
            "fr": "Boisson gazeuse.",
            "en": "Fizzy drink.",
            "de": "Sprudelgetr\xE4nk.",
            "ar": "\u0645\u0634\u0631\u0648\u0628 \u063A\u0627\u0632\u064A \u0628\u0639\u0635\u064A\u0631 \u0648\u0644\u0628 \u0627\u0644\u0628\u0631\u062A\u0642\u0627\u0644 \u0627\u0644\u0637\u0628\u064A\u0639\u064A \u0627\u0644\u0645\u0646\u0639\u0634."
          },
          "price": "17",
          "image": "images/soda-orangina.webp"
        },
        {
          "name": {
            "fr": "SCHWEPPES CITRON/TONIC",
            "en": "SCHWEPPES LEMON/TONIC",
            "de": "SCHWEPPES ZITRONE/TONIC",
            "ar": "\u0634\u0648\u064A\u0628\u0633 \u0644\u064A\u0645\u0648\u0646 \u0623\u0648 \u062A\u0648\u0646\u064A\u0643"
          },
          "description": {
            "fr": "Boisson gazeuse.",
            "en": "Fizzy drink.",
            "de": "Sprudelgetr\xE4nk.",
            "ar": "\u0645\u0634\u0631\u0648\u0628 \u063A\u0627\u0632\u064A \u0634\u0648\u064A\u0628\u0633 \u0645\u0646\u0639\u0634 \u0628\u0646\u0643\u0647\u0629 \u0627\u0644\u0644\u064A\u0645\u0648\u0646 \u0623\u0648 \u0645\u0627\u0621 \u0627\u0644\u062A\u0648\u0646\u064A\u0643."
          },
          "price": "17",
          "image": "images/soda-schweppes.webp"
        }
      ]
    },
    {
      "category": {
        "fr": "EAU MIN\xC9RALE",
        "en": "MINERAL WATER",
        "de": "MINERALWASSER",
        "ar": "\u0645\u064A\u0627\u0647 \u0645\u0639\u062F\u0646\u064A\u0629"
      },
      "items": [
        {
          "name": {
            "fr": "OULMES 0.75 l",
            "en": "OULMES (Sparkling)0.75 l",
            "de": "OULMES (Sprudel)0.75 l",
            "ar": "\u0645\u0627\u0621 \u0648\u0627\u0644\u0645\u0627\u0633 \u063A\u0627\u0632\u064A \u0637\u0628\u064A\u0639\u064A (0.75 \u0644\u062A\u0631)"
          },
          "description": {
            "fr": "Eau min\xE9rale gazeuse.",
            "en": "Sparkling mineral water.",
            "de": "Sprudelndes Mineralwasser.",
            "ar": "\u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A \u063A\u0627\u0632\u064A \u0637\u0628\u064A\u0639\u064A \u0641\u0648\u0627\u0631 \u0645\u0646\u0639\u0634 \u0628\u062D\u062C\u0645 \u0643\u0628\u064A\u0631 75 \u0633\u0646\u062A\u0644\u062A\u0631."
          },
          "price": "26",
          "image": "images/eau-oulmes75cl.webp"
        },
        {
          "name": {
            "fr": "0.75 l",
            "en": "0.75 l",
            "de": "0.75 l",
            "ar": "\u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A \u0637\u0628\u064A\u0639\u064A \u0639\u064A\u0646 \u0633\u0627\u064A\u0633 (0.75 \u0644\u062A\u0631)"
          },
          "description": {
            "fr": "Bouteille d'eau min\xE9rale 75 cl.",
            "en": "75 cl mineral water bottle.",
            "de": "75 cl Mineralwasserflasche.",
            "ar": "\u0642\u0646\u064A\u0646\u0629 \u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A \u0637\u0628\u064A\u0639\u064A \u0646\u0642\u064A \u0628\u062D\u062C\u0645 \u0643\u0628\u064A\u0631 75 \u0633\u0646\u062A\u0644\u062A\u0631."
          },
          "price": "22",
          "image": "images/eau-75.webp"
        },
        {
          "name": {
            "fr": "OULMES",
            "en": "OULMES (Sparkling)",
            "de": "OULMES (Sprudel)",
            "ar": "\u0645\u0627\u0621 \u0648\u0627\u0644\u0645\u0627\u0633 \u063A\u0627\u0632\u064A \u0637\u0628\u064A\u0639\u064A (0.5 \u0644\u062A\u0631)"
          },
          "description": {
            "fr": "Eau min\xE9rale gazeuse.",
            "en": "Sparkling mineral water.",
            "de": "Sprudelndes Mineralwasser.",
            "ar": "\u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A \u063A\u0627\u0632\u064A \u0637\u0628\u064A\u0639\u064A \u0641\u0648\u0627\u0631 \u0645\u0646\u0639\u0634 \u0628\u062D\u062C\u0645 \u0641\u0631\u062F\u064A 50 \u0633\u0646\u062A\u0644\u062A\u0631."
          },
          "price": "16",
          "image": "images/eau-oulmes.webp"
        },
        {
          "name": {
            "fr": "0.5 l",
            "en": "0.5 l",
            "de": "0.5 l",
            "ar": "\u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A \u0637\u0628\u064A\u0639\u064A \u0639\u064A\u0646 \u0633\u0627\u064A\u0633 (0.5 \u0644\u062A\u0631)"
          },
          "description": {
            "fr": "Bouteille d'eau min\xE9rale 50 cl.",
            "en": "50 cl mineral water bottle.",
            "de": "50 cl Mineralwasserflasche.",
            "ar": "\u0642\u0646\u064A\u0646\u0629 \u0645\u0627\u0621 \u0645\u0639\u062F\u0646\u064A \u0637\u0628\u064A\u0639\u064A \u0646\u0642\u064A \u0628\u062D\u062C\u0645 50 \u0633\u0646\u062A\u0644\u062A\u0631."
          },
          "price": "12",
          "image": "images/eau-50.webp"
        }
      ]
    },
    {
      "category": {
        "fr": "BOISSONS FRA\xCECHES (JUS)",
        "en": "FRESH DRINKS (JUICES)",
        "de": "FRISCHE GETR\xC4NKE (S\xC4FTE)",
        "ar": "\u0639\u0635\u0627\u0626\u0631 \u0637\u0627\u0632\u062C\u0629"
      },
      "id": "boissons",
      "items": [
        {
          "name": {
            "fr": "COCKTAIL ORANGE",
            "en": "ORANGE COCKTAIL",
            "de": "ORANGEN-COCKTAIL",
            "ar": "\u0643\u0648\u0643\u062A\u064A\u0644 \u0628\u0631\u062A\u0642\u0627\u0644 \u0645\u0634\u0643\u0644"
          },
          "description": {
            "fr": "Cocktail \xE0 base d'orange.",
            "en": "Orange-based cocktail.",
            "de": "Cocktail auf Orangenbasis.",
            "ar": "\u0643\u0648\u0643\u062A\u064A\u0644 \u0639\u0635\u064A\u0631 \u0628\u0631\u062A\u0642\u0627\u0644 \u0637\u0628\u064A\u0639\u064A \u0645\u0646\u0639\u0634 \u0645\u0645\u0632\u0648\u062C \u0628\u0627\u0644\u0641\u0648\u0627\u0643\u0647 \u0627\u0644\u0637\u0627\u0632\u062C\u0629."
          },
          "price": "42",
          "image": "images/jus-cocktailorange.webp"
        },
        {
          "name": {
            "fr": "JUS DE FRUITS SECS AVOCAT",
            "en": "AVOCADO DRIED FRUIT JUICE",
            "de": "AVOCADO-NUSSFR\xDCCHTE SAFT",
            "ar": "\u0639\u0635\u064A\u0631 \u0623\u0641\u0648\u0643\u0627\u062F\u0648 \u0628\u0627\u0644\u0641\u0648\u0627\u0643\u0647 \u0627\u0644\u062C\u0627\u0641\u0629"
          },
          "description": {
            "fr": "M\xE9lange d'avocat et de fruits secs.",
            "en": "Blend of avocado and dried fruits.",
            "de": "Mischung aus Avocado und Nussfr\xFCchten.",
            "ar": "\u0639\u0635\u064A\u0631 \u0623\u0641\u0648\u0643\u0627\u062F\u0648 \u0643\u0631\u064A\u0645\u064A \u0645\u0645\u0632\u0648\u062C \u0628\u0627\u0644\u062D\u0644\u064A\u0628 \u0648\u0627\u0644\u0645\u0643\u0633\u0631\u0627\u062A (\u0644\u0648\u0632\u060C \u062C\u0648\u0632) \u0648\u0627\u0644\u062A\u0645\u0648\u0631."
          },
          "price": "38",
          "image": "images/jus-avocatsec.webp"
        },
        {
          "name": {
            "fr": "JUS DE FRAMBOISE",
            "en": "RASPBERRY JUICE",
            "de": "HIMBEERSAFT",
            "ar": "\u0639\u0635\u064A\u0631 \u062A\u0648\u062A \u0627\u0644\u0639\u0644\u064A\u0642 \u0627\u0644\u0637\u0627\u0632\u062C"
          },
          "description": {
            "fr": "Jus de framboise frais.",
            "en": "Fresh raspberry juice.",
            "de": "Frischer Himbeersaft.",
            "ar": "\u0639\u0635\u064A\u0631 \u062A\u0648\u062A \u0627\u0644\u0639\u0644\u064A\u0642 (\u0627\u0644\u0641\u0631\u064A\u0632 \u0627\u0644\u0628\u0631\u064A) \u0627\u0644\u0637\u0627\u0632\u062C \u0627\u0644\u063A\u0646\u064A \u0648\u0627\u0644\u0645\u0646\u0639\u0634."
          },
          "price": "35",
          "image": "images/jus-framboise.webp"
        },
        {
          "name": {
            "fr": "JUS D'AVOCAT",
            "en": "AVOCADO JUICE",
            "de": "AVOCADOSAFT",
            "ar": "\u0639\u0635\u064A\u0631 \u0623\u0641\u0648\u0643\u0627\u062F\u0648 \u0637\u0627\u0632\u062C"
          },
          "description": {
            "fr": "Jus d'avocat frais.",
            "en": "Fresh avocado juice.",
            "de": "Frischer Avocadosaft.",
            "ar": "\u0639\u0635\u064A\u0631 \u0623\u0641\u0648\u0643\u0627\u062F\u0648 \u0637\u0627\u0632\u062C \u0628\u0642\u0648\u0627\u0645 \u0646\u0627\u0639\u0645 \u0648\u0643\u0631\u064A\u0645\u064A \u0628\u0627\u0644\u062D\u0644\u064A\u0628."
          },
          "price": "32",
          "image": "images/jus-avocat.webp"
        },
        {
          "name": {
            "fr": "JUS D'ANANAS",
            "en": "PINEAPPLE JUICE",
            "de": "ANANASSAFT",
            "ar": "\u0639\u0635\u064A\u0631 \u0623\u0646\u0627\u0646\u0627\u0633 \u0637\u0628\u064A\u0639\u064A"
          },
          "description": {
            "fr": "Jus d'ananas frais.",
            "en": "Fresh pineapple juice.",
            "de": "Frischer Ananassaft.",
            "ar": "\u0639\u0635\u064A\u0631 \u0623\u0646\u0627\u0646\u0627\u0633 \u0627\u0633\u062A\u0648\u0627\u0626\u064A \u0637\u0627\u0632\u062C \u0645\u0639\u0635\u0648\u0631 \u0648\u063A\u0646\u064A \u0628\u0627\u0644\u0627\u0646\u062A\u0639\u0627\u0634."
          },
          "price": "32",
          "image": "images/jus-ananas.webp"
        },
        {
          "name": {
            "fr": "JUS DE MANGUE",
            "en": "MANGO JUICE",
            "de": "MANGOSSAFT",
            "ar": "\u0639\u0635\u064A\u0631 \u0645\u0627\u0646\u062C\u0648 \u0637\u0627\u0632\u062C"
          },
          "description": {
            "fr": "Jus de mangue fra\xEEche.",
            "en": "Fresh mango juice.",
            "de": "Frischer Mangosaft.",
            "ar": "\u0639\u0635\u064A\u0631 \u0645\u0627\u0646\u062C\u0648 \u0627\u0633\u062A\u0648\u0627\u0626\u064A \u0637\u0628\u064A\u0639\u064A \u063A\u0646\u064A \u0648\u0646\u0627\u0639\u0645."
          },
          "price": "30",
          "image": "images/jus-mangue.webp"
        },
        {
          "name": {
            "fr": "JUS DE P\xCACHE",
            "en": "PEACH JUICE",
            "de": "PFIRSICHSAFT",
            "ar": "\u0639\u0635\u064A\u0631 \u062E\u0648\u062E \u0637\u0628\u064A\u0639\u064A"
          },
          "description": {
            "fr": "Jus de p\xEAche fra\xEEche.",
            "en": "Fresh peach juice.",
            "de": "Frischer Pfirsichsaft.",
            "ar": "\u0639\u0635\u064A\u0631 \u062E\u0648\u062E \u0637\u0628\u064A\u0639\u064A \u0637\u0627\u0632\u062C \u0628\u0645\u0630\u0627\u0642 \u062D\u0644\u0648 \u0648\u0645\u0646\u0639\u0634."
          },
          "price": "30",
          "image": "images/jus-peche.webp"
        },
        {
          "name": {
            "fr": "JUS DE FRAISE",
            "en": "STRAWBERRY JUICE",
            "de": "ERDBEERSAFT",
            "ar": "\u0639\u0635\u064A\u0631 \u0641\u0631\u0627\u0648\u0644\u0629 \u0637\u0627\u0632\u062C\u0629"
          },
          "description": {
            "fr": "Jus de fraise fra\xEEche.",
            "en": "Fresh strawberry juice.",
            "de": "Frischer Erdbeersaft.",
            "ar": "\u0639\u0635\u064A\u0631 \u0641\u0631\u0627\u0648\u0644\u0629 \u0637\u0628\u064A\u0639\u064A\u0629 \u0637\u0627\u0632\u062C\u0629 \u0645\u0639\u0635\u0648\u0631\u0629 \u0628\u0644\u0648\u0646\u0647\u0627 \u0648\u0645\u0630\u0627\u0642\u0647\u0627 \u0627\u0644\u0631\u0627\u0626\u0639."
          },
          "price": "30",
          "image": "images/jus-fraise.webp"
        },
        {
          "name": {
            "fr": "JUS DE POMME / BANANE",
            "en": "APPLE / BANANA JUICE",
            "de": "APFEL / BANANENSAFT",
            "ar": "\u0639\u0635\u064A\u0631 \u062A\u0641\u0627\u062D \u0623\u0648 \u0645\u0648\u0632 \u0628\u0627\u0644\u062D\u0644\u064A\u0628"
          },
          "description": {
            "fr": "Jus de pomme ou de banane.",
            "en": "Apple or banana juice.",
            "de": "Apfel- oder Bananensaft.",
            "ar": "\u0639\u0635\u064A\u0631 \u062A\u0641\u0627\u062D \u0637\u0627\u0632\u062C \u0623\u0648 \u0639\u0635\u064A\u0631 \u0645\u0648\u0632 \u0645\u063A\u0630\u064A \u0645\u062E\u0641\u0648\u0642 \u0645\u0639 \u0627\u0644\u062D\u0644\u064A\u0628 \u062D\u0633\u0628 \u0627\u062E\u062A\u064A\u0627\u0631\u0643."
          },
          "price": "28",
          "image": "images/jus-pomme-banane.webp"
        },
        {
          "name": {
            "fr": "JUS DE CITRON",
            "en": "LEMON JUICE",
            "de": "ZITRONENSAFT",
            "ar": "\u0639\u0635\u064A\u0631 \u0644\u064A\u0645\u0648\u0646 \u0645\u0646\u0639\u0634"
          },
          "description": {
            "fr": "Jus de citron frais.",
            "en": "Fresh lemon juice.",
            "de": "Frischer Zitronensaft.",
            "ar": "\u0639\u0635\u064A\u0631 \u0644\u064A\u0645\u0648\u0646 \u062D\u0627\u0645\u0636 \u0637\u0628\u064A\u0639\u064A \u0645\u0646\u0639\u0634 \u0648\u0645\u062B\u0644\u062C."
          },
          "price": "25",
          "image": "images/jus-citron.webp"
        },
        {
          "name": {
            "fr": "JUS DE CAROTTE",
            "en": "CARROT JUICE",
            "de": "KAROTTENSAFT",
            "ar": "\u0639\u0635\u064A\u0631 \u062C\u0632\u0631 \u0637\u0627\u0632\u062C"
          },
          "description": {
            "fr": "Jus de carotte frais.",
            "en": "Fresh carrot juice.",
            "de": "Frischer Karottensaft.",
            "ar": "\u0639\u0635\u064A\u0631 \u062C\u0632\u0631 \u0637\u0628\u064A\u0639\u064A 100% \u0645\u0639\u0635\u0648\u0631 \u0641\u0648\u0631\u064A\u0627\u064B \u0648\u063A\u0646\u064A \u0628\u0627\u0644\u0641\u064A\u062A\u0627\u0645\u064A\u0646\u0627\u062A."
          },
          "price": "25",
          "image": "images/jus-carotte.webp"
        },
        {
          "name": {
            "fr": "JUS D'ORANGE",
            "en": "ORANGE JUICE",
            "de": "ORANGENSAFT",
            "ar": "\u0639\u0635\u064A\u0631 \u0628\u0631\u062A\u0642\u0627\u0644 \u0637\u0627\u0632\u062C \u0645\u0639\u0635\u0648\u0631"
          },
          "description": {
            "fr": "Jus d'orange frais press\xE9.",
            "en": "Freshly squeezed orange juice.",
            "de": "Frisch gepresster Orangensaft.",
            "ar": "\u0639\u0635\u064A\u0631 \u0628\u0631\u062A\u0642\u0627\u0644 \u0645\u063A\u0631\u0628\u064A \u0637\u0627\u0632\u062C 100% \u0645\u0639\u0635\u0648\u0631 \u0641\u0648\u0631\u064A\u0627\u064B \u0648\u063A\u0646\u064A \u0628\u0641\u064A\u062A\u0627\u0645\u064A\u0646 \u0633\u064A."
          },
          "price": "22",
          "image": "images/jus-orange.webp"
        }
      ]
    },
    {
      "category": {
        "fr": "ICE TEA",
        "en": "ICE TEA",
        "de": "EISTEE",
        "ar": "\u0634\u0627\u064A \u0645\u062B\u0644\u062C"
      },
      "items": [
        {
          "name": {
            "fr": "ICE TEA CITRON",
            "en": "LEMON ICE TEA",
            "de": "ZITRONEN-EISTEE",
            "ar": "\u0634\u0627\u064A \u0645\u062B\u0644\u062C \u0628\u0627\u0644\u0644\u064A\u0645\u0648\u0646"
          },
          "description": {
            "fr": "Th\xE9 glac\xE9 saveur citron.",
            "en": "Lemon flavored iced tea.",
            "de": "Eistee mit Zitronengeschmack.",
            "ar": "\u0634\u0627\u064A \u0645\u062B\u0644\u062C \u0645\u0646\u0639\u0634 \u0628\u0646\u0643\u0647\u0629 \u0627\u0644\u0644\u064A\u0645\u0648\u0646 \u0627\u0644\u062D\u0627\u0645\u0636 \u0648\u0627\u0644\u062B\u0644\u062C \u0627\u0644\u0645\u062C\u0631\u0648\u0634."
          },
          "price": "28",
          "image": "images/icetea-citron.webp"
        },
        {
          "name": {
            "fr": "ICE TEA P\xCACHE",
            "en": "PEACH ICE TEA",
            "de": "PFIRSICH-EISTEE",
            "ar": "\u0634\u0627\u064A \u0645\u062B\u0644\u062C \u0628\u0627\u0644\u062E\u0648\u062E"
          },
          "description": {
            "fr": "Th\xE9 glac\xE9 saveur p\xEAche.",
            "en": "Peach flavored iced tea.",
            "de": "Eistee mit Pfirsichgeschmack.",
            "ar": "\u0634\u0627\u064A \u0645\u062B\u0644\u062C \u0645\u0646\u0639\u0634 \u0648\u0645\u062D\u0644\u0649 \u0628\u0646\u0643\u0647\u0629 \u0627\u0644\u062E\u0648\u062E \u0627\u0644\u0637\u0628\u064A\u0639\u064A\u0629 \u0627\u0644\u0644\u0630\u064A\u0630\u0629."
          },
          "price": "28",
          "image": "images/icetea-peche.webp"
        },
        {
          "name": {
            "fr": "ICE TEA FRAMBOISE",
            "en": "RASPBERRY ICE TEA",
            "de": "HIMBEER-EISTEE",
            "ar": "\u0634\u0627\u064A \u0645\u062B\u0644\u062C \u0628\u0627\u0644\u062A\u0648\u062A"
          },
          "description": {
            "fr": "Th\xE9 glac\xE9 saveur framboise.",
            "en": "Raspberry flavored iced tea.",
            "de": "Eistee mit Himbeergeschmack.",
            "ar": "\u0634\u0627\u064A \u0645\u062B\u0644\u062C \u0645\u0646\u0639\u0634 \u0628\u0646\u0643\u0647\u0629 \u062A\u0648\u062A \u0627\u0644\u0639\u0644\u064A\u0642 \u0627\u0644\u0623\u062D\u0645\u0631."
          },
          "price": "28",
          "image": "images/icetea-framboise.webp"
        }
      ]
    },
    {
      "category": {
        "fr": "ICE COFFEE",
        "en": "ICE COFFEE",
        "de": "EISKAFFEE",
        "ar": "\u0642\u0647\u0648\u0629 \u0645\u062B\u0644\u062C\u0629"
      },
      "items": [
        {
          "name": {
            "fr": "CAF\xC9 GLAC\xC9 AROMATIS\xC9",
            "en": "FLAVORED ICE COFFEE",
            "de": "AROMATISIERTER EISKAFFEE",
            "ar": "\u0642\u0647\u0648\u0629 \u0645\u062B\u0644\u062C\u0629 \u0645\u0646\u0643\u0647\u0629"
          },
          "description": {
            "fr": "Caf\xE9 glac\xE9 avec un ar\xF4me au choix.",
            "en": "Iced coffee with a flavor of choice.",
            "de": "Eiskaffee mit Geschmack nach Wahl.",
            "ar": "\u0642\u0647\u0648\u0629 \u0645\u062B\u0644\u062C\u0629 \u0628\u0627\u0644\u062D\u0644\u064A\u0628 \u0648\u0627\u0644\u062B\u0644\u062C \u0645\u0639 \u0646\u0643\u0647\u0629 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643 (\u0643\u0631\u0627\u0645\u064A\u0644\u060C \u0641\u0627\u0646\u064A\u0644\u064A\u0627\u060C \u0623\u0648 \u0628\u0646\u062F\u0642)."
          },
          "price": "23",
          "image": "images/icecoffee-arom.webp"
        },
        {
          "name": {
            "fr": "CAF\xC9 GLAC\xC9 CLASSIQUE",
            "en": "CLASSIC ICE COFFEE",
            "de": "KLASSISCHER EISKAFFEE",
            "ar": "\u0642\u0647\u0648\u0629 \u0645\u062B\u0644\u062C\u0629 \u0643\u0644\u0627\u0633\u064A\u0643\u064A\u0629"
          },
          "description": {
            "fr": "Caf\xE9 glac\xE9 traditionnel.",
            "en": "Traditional iced coffee.",
            "de": "Traditioneller Eiskaffee.",
            "ar": "\u0642\u0647\u0648\u0629 \u0645\u062B\u0644\u062C\u0629 \u062A\u0642\u0644\u064A\u062F\u064A\u0629 \u0645\u0646\u0639\u0634\u0629 \u0645\u062D\u0636\u0631\u0629 \u0628\u0627\u0644\u0625\u0633\u0628\u0631\u064A\u0633\u0648 \u0648\u0627\u0644\u062D\u0644\u064A\u0628 \u0627\u0644\u0628\u0627\u0631\u062F \u0648\u0645\u0643\u0639\u0628\u0627\u062A \u0627\u0644\u062B\u0644\u062C."
          },
          "price": "20",
          "image": "images/icecoffee-class.webp"
        }
      ]
    },
    {
      "category": {
        "fr": "FRAPPUCCINO",
        "en": "FRAPPUCCINO",
        "de": "FRAPPUCCINO",
        "ar": "\u0641\u0631\u0627\u0628\u062A\u0634\u064A\u0646\u0648"
      },
      "items": [
        {
          "name": {
            "fr": "FRAPPUCCINO AROMATIS\xC9",
            "en": "FLAVORED FRAPPUCCINO",
            "de": "AROMATISIERTER FRAPPUCCINO",
            "ar": "\u0641\u0631\u0627\u0628\u062A\u0634\u064A\u0646\u0648 \u0645\u062B\u0644\u062C \u0645\u0646\u0643\u0647"
          },
          "description": {
            "fr": "Frappuccino avec un ar\xF4me au choix.",
            "en": "Frappuccino with a flavor of choice.",
            "de": "Frappuccino mit Geschmack nach Wahl.",
            "ar": "\u0645\u0634\u0631\u0648\u0628 \u0641\u0631\u0627\u0628\u062A\u0634\u064A\u0646\u0648 \u0645\u062E\u0641\u0648\u0642 \u0628\u0627\u0644\u062B\u0644\u062C \u0648\u0627\u0644\u0642\u0647\u0648\u0629 \u0645\u0639 \u0646\u0643\u0647\u0629 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643 (\u0643\u0631\u0627\u0645\u064A\u0644\u060C \u0641\u0627\u0646\u064A\u0644\u064A\u0627\u060C \u0623\u0648 \u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629)."
          },
          "price": "28",
          "image": "images/frappu-arom.webp"
        },
        {
          "name": {
            "fr": "FRAPPUCCINO CLASSIQUE",
            "en": "CLASSIC FRAPPUCCINO",
            "de": "KLASSISCHER FRAPPUCCINO",
            "ar": "\u0641\u0631\u0627\u0628\u062A\u0634\u064A\u0646\u0648 \u0645\u062B\u0644\u062C \u0643\u0644\u0627\u0633\u064A\u0643\u064A"
          },
          "description": {
            "fr": "Boisson glac\xE9e \xE0 base de caf\xE9, style frapp\xE9.",
            "en": "Blended iced coffee drink, frapp\xE9 style.",
            "de": "Gemischtes Eiskaffeegetr\xE4nk, Frapp\xE9-Stil.",
            "ar": "\u0645\u0634\u0631\u0648\u0628 \u0642\u0647\u0648\u0629 \u0645\u062B\u0644\u062C\u0629 \u0645\u062E\u0641\u0648\u0642\u0629 \u0639\u0644\u0649 \u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u0641\u0631\u0627\u0628\u064A \u0627\u0644\u0643\u0644\u0627\u0633\u064A\u0643\u064A\u0629 \u0645\u0639 \u0627\u0644\u0643\u0631\u064A\u0645\u0629."
          },
          "price": "25",
          "image": "images/frappu-class.webp"
        }
      ]
    },
    {
      "category": {
        "fr": "COCKTAILS",
        "en": "COCKTAILS",
        "de": "COCKTAILS",
        "ar": "\u0643\u0648\u0643\u062A\u064A\u0644\u0627\u062A"
      },
      "items": [
        {
          "name": {
            "fr": "FRA\xCECHEUR",
            "en": "FRESHNESS",
            "de": "FRISCHE",
            "ar": "\u0643\u0648\u0643\u062A\u064A\u0644 \u0627\u0644\u0627\u0646\u062A\u0639\u0627\u0634 (\u0641\u0631\u064A\u0634\u0648\u0631)"
          },
          "description": {
            "fr": "Ananas, poire, citron, menthe.",
            "en": "Pineapple, pear, lemon, mint.",
            "de": "Ananas, Birne, Zitrone, Minze.",
            "ar": "\u0623\u0646\u0627\u0646\u0627\u0633\u060C \u0625\u062C\u0627\u0635 (\u0628\u0648\u0639\u0648\u064A\u062F)\u060C \u0644\u064A\u0645\u0648\u0646 \u062D\u0627\u0645\u0636\u060C \u0648\u0623\u0648\u0631\u0627\u0642 \u0627\u0644\u0646\u0639\u0646\u0627\u0639 \u0627\u0644\u0637\u0627\u0632\u062C\u0629."
          },
          "price": "42",
          "image": "images/cocktail-fraicheur.webp"
        },
        {
          "name": {
            "fr": "TROPICAL",
            "en": "TROPICAL",
            "de": "TROPISCH",
            "ar": "\u0643\u0648\u0643\u062A\u064A\u0644 \u062A\u0631\u0648\u0628\u064A\u0643\u0627\u0644 \u0627\u0633\u062A\u0648\u0627\u0626\u064A"
          },
          "description": {
            "fr": "Mangue, banane, orange, bissap.",
            "en": "Mango, banana, orange, hibiscus.",
            "de": "Mango, Banane, Orange, Hibiskus.",
            "ar": "\u0645\u0627\u0646\u062C\u0648\u060C \u0645\u0648\u0632\u060C \u0628\u0631\u062A\u0642\u0627\u0644\u060C \u0648\u0639\u0635\u064A\u0631 \u0627\u0644\u0643\u0631\u0643\u062F\u064A\u0647 (\u0628\u064A\u0633\u0627\u0628) \u0627\u0644\u0645\u0646\u0639\u0634."
          },
          "price": "42",
          "image": "images/cocktail-tropical.webp"
        },
        {
          "name": {
            "fr": "PINA COLADA",
            "en": "PINA COLADA",
            "de": "PINA COLADA",
            "ar": "\u0628\u064A\u0646\u0627 \u0643\u0648\u0644\u0627\u062F\u0627 \u0627\u0633\u062A\u0648\u0627\u0626\u064A\u0629"
          },
          "description": {
            "fr": "Ananas, noix de coco.",
            "en": "Pineapple, coconut.",
            "de": "Ananas, Kokosnuss.",
            "ar": "\u0639\u0635\u064A\u0631 \u0623\u0646\u0627\u0646\u0627\u0633 \u0637\u0628\u064A\u0639\u064A \u0645\u062E\u0641\u0648\u0642 \u0645\u0639 \u062D\u0644\u064A\u0628 \u0648\u0643\u0631\u064A\u0645\u0629 \u062C\u0648\u0632 \u0627\u0644\u0647\u0646\u062F \u0648\u0627\u0644\u062B\u0644\u062C."
          },
          "price": "42",
          "image": "images/cocktail-pinacolada.webp"
        },
        {
          "name": {
            "fr": "COCKTAIL GINGEMBRE",
            "en": "GINGER COCKTAIL",
            "de": "INGWER-COCKTAIL",
            "ar": "\u0643\u0648\u0643\u062A\u064A\u0644 \u0627\u0644\u0632\u0646\u062C\u0628\u064A\u0644 \u0627\u0644\u0645\u0646\u0639\u0634"
          },
          "description": {
            "fr": "Gingembre, citron, miel.",
            "en": "Ginger, lemon, honey.",
            "de": "Ingwer, Zitrone, Honig.",
            "ar": "\u0632\u0646\u062C\u0628\u064A\u0644 \u0637\u0627\u0632\u062C\u060C \u0639\u0635\u064A\u0631 \u0644\u064A\u0645\u0648\u0646 \u062D\u0627\u0645\u0636\u060C \u0648\u0639\u0633\u0644 \u0637\u0628\u064A\u0639\u064A \u0646\u0642\u064A."
          },
          "price": "32",
          "image": "images/cocktail-gingembre.webp"
        },
        {
          "name": {
            "fr": "SAN FRANCISCO",
            "en": "SAN FRANCISCO",
            "de": "SAN FRANCISCO",
            "ar": "\u0643\u0648\u0643\u062A\u064A\u0644 \u0633\u0627\u0646 \u0641\u0631\u0627\u0646\u0633\u064A\u0633\u0643\u0648"
          },
          "description": {
            "fr": "Gingembre, bissap, orange, citron.",
            "en": "Ginger, hibiscus, orange, lemon.",
            "de": "Ingwer, Hibiskus, Orange, Zitrone.",
            "ar": "\u0632\u0646\u062C\u0628\u064A\u0644\u060C \u0643\u0631\u0643\u062F\u064A\u0647 (\u0628\u064A\u0633\u0627\u0628)\u060C \u0639\u0635\u064A\u0631 \u0628\u0631\u062A\u0642\u0627\u0644\u060C \u0648\u0639\u0635\u064A\u0631 \u0644\u064A\u0645\u0648\u0646 \u0645\u0646\u0639\u0634."
          },
          "price": "34",
          "image": "images/cocktail-sf.webp"
        }
      ]
    },
    {
      "category": {
        "fr": "MOJITO",
        "en": "MOJITO",
        "de": "MOJITO",
        "ar": "\u0645\u0648\u0647\u064A\u062A\u0648"
      },
      "items": [
        {
          "name": {
            "fr": "MOJITO REDBULL",
            "en": "REDBULL MOJITO",
            "de": "REDBULL MOJITO",
            "ar": "\u0645\u0648\u0647\u064A\u062A\u0648 \u0631\u064A\u062F \u0628\u0648\u0644"
          },
          "description": {
            "fr": "Mojito \xE9nergisant au Redbull.",
            "en": "Energizing mojito with Redbull.",
            "de": "Belebender Mojito mit Redbull.",
            "ar": "\u0645\u0648\u0647\u064A\u062A\u0648 \u0645\u0646\u0639\u0634 \u0628\u0645\u0634\u0631\u0648\u0628 \u0627\u0644\u0637\u0627\u0642\u0629 \u0631\u064A\u062F \u0628\u0648\u0644\u060C \u0627\u0644\u0644\u064A\u0645\u0648\u0646 \u0627\u0644\u062D\u0627\u0645\u0636\u060C \u0648\u0627\u0644\u0646\u0639\u0646\u0627\u0639 \u0627\u0644\u0637\u0627\u0632\u062C \u0645\u0639 \u0627\u0644\u062B\u0644\u062C \u0627\u0644\u0645\u062C\u0631\u0648\u0634."
          },
          "price": "44",
          "image": "images/mojito-redbull.webp"
        },
        {
          "name": {
            "fr": "MOJITO TROPICAL",
            "en": "TROPICAL MOJITO",
            "de": "TROPISCHER MOJITO",
            "ar": "\u0645\u0648\u0647\u064A\u062A\u0648 \u0627\u0633\u062A\u0648\u0627\u0626\u064A (\u062A\u0631\u0648\u0628\u064A\u0643\u0627\u0644)"
          },
          "description": {
            "fr": "Mojito aux saveurs tropicales.",
            "en": "Mojito with tropical flavors.",
            "de": "Mojito mit tropischen Aromen.",
            "ar": "\u0645\u0648\u0647\u064A\u062A\u0648 \u0645\u0646\u0639\u0634 \u0628\u0646\u0643\u0647\u0627\u062A \u0627\u0644\u0641\u0648\u0627\u0643\u0647 \u0627\u0644\u0627\u0633\u062A\u0648\u0627\u0626\u064A\u0629\u060C \u0627\u0644\u0644\u064A\u0645\u0648\u0646\u060C \u0648\u0627\u0644\u0646\u0639\u0646\u0627\u0639 \u0627\u0644\u0637\u0627\u0632\u062C."
          },
          "price": "38",
          "image": "images/mojito-tropical.webp"
        },
        {
          "name": {
            "fr": "MOJITO CITRON",
            "en": "LEMON MOJITO",
            "de": "ZITRONEN MOJITO",
            "ar": "\u0645\u0648\u0647\u064A\u062A\u0648 \u0644\u064A\u0645\u0648\u0646 \u0648\u0646\u0639\u0646\u0627\u0639 \u0643\u0644\u0627\u0633\u064A\u0643"
          },
          "description": {
            "fr": "Mojito classique au citron.",
            "en": "Classic lemon mojito.",
            "de": "Klassischer Zitronen Mojito.",
            "ar": "\u0645\u0648\u0647\u064A\u062A\u0648 \u0643\u0644\u0627\u0633\u064A\u0643\u064A \u0645\u0646\u0639\u0634 \u0628\u0639\u0635\u064A\u0631 \u0627\u0644\u0644\u064A\u0645\u0648\u0646 \u0648\u0627\u0644\u0646\u0639\u0646\u0627\u0639 \u0627\u0644\u0637\u0627\u0632\u062C \u0648\u0627\u0644\u0635\u0648\u062F\u0627 \u0627\u0644\u0641\u0648\u0627\u0631\u0629."
          },
          "price": "34",
          "image": "images/mojito-citron.webp"
        }
      ]
    },
    {
      "category": {
        "fr": "SMOOTHIES",
        "en": "SMOOTHIES",
        "de": "SMOOTHIES",
        "ar": "\u0633\u0645\u0648\u0630\u064A"
      },
      "items": [
        {
          "name": {
            "fr": "PINK SMOOTHIE",
            "en": "PINK SMOOTHIE",
            "de": "PINK SMOOTHIE",
            "ar": "\u0628\u064A\u0646\u0643 \u0633\u0645\u0648\u0630\u064A \u0627\u0644\u0648\u0631\u062F\u064A"
          },
          "description": {
            "fr": "Framboise, orange, fraise.",
            "en": "Raspberry, orange, strawberry.",
            "de": "Himbeere, Orange, Erdbeere.",
            "ar": "\u062A\u0648\u062A \u0627\u0644\u0639\u0644\u064A\u0642\u060C \u0639\u0635\u064A\u0631 \u0628\u0631\u062A\u0642\u0627\u0644\u060C \u0648\u0641\u0631\u0627\u0648\u0644\u0629 \u0637\u0627\u0632\u062C\u0629 \u0645\u062E\u0641\u0648\u0642\u0629."
          },
          "price": "48",
          "image": "images/smoothie-pink.webp"
        },
        {
          "name": {
            "fr": "TRIPLE BERRY",
            "en": "TRIPLE BERRY",
            "de": "TRIPLE BERRY",
            "ar": "\u0633\u0645\u0648\u0630\u064A \u062A\u0631\u064A\u0628\u0644 \u0628\u064A\u0631\u064A (\u0627\u0644\u062A\u0648\u062A \u0627\u0644\u062B\u0644\u0627\u062B\u064A)"
          },
          "description": {
            "fr": "Myrtille, framboise, fraise.",
            "en": "Blueberry, raspberry, strawberry.",
            "de": "Blaubeere, Himbeere, Erdbeere.",
            "ar": "\u062A\u0648\u062A \u0623\u0632\u0631\u0642\u060C \u062A\u0648\u062A \u0627\u0644\u0639\u0644\u064A\u0642\u060C \u0648\u0641\u0631\u0627\u0648\u0644\u0629 \u0637\u0627\u0632\u062C\u0629 \u0645\u0646\u0639\u0634\u0629."
          },
          "price": "48",
          "image": "images/smoothie-triple.webp"
        },
        {
          "name": {
            "fr": "\xC9NERG\xC9TIQUE",
            "en": "ENERGETIC",
            "de": "ENERGETISCH",
            "ar": "\u0633\u0645\u0648\u0630\u064A \u0627\u0644\u0637\u0627\u0642\u0629 \u0648\u0627\u0644\u0646\u0634\u0627\u0637"
          },
          "description": {
            "fr": "Banane, ananas, mangue.",
            "en": "Banana, pineapple, mango.",
            "de": "Banane, Ananas, Mango.",
            "ar": "\u0645\u0648\u0632\u060C \u0623\u0646\u0627\u0646\u0627\u0633 \u0627\u0633\u062A\u0648\u0627\u0626\u064A\u060C \u0648\u0645\u0627\u0646\u062C\u0648 \u0637\u0628\u064A\u0639\u064A \u063A\u0646\u064A \u0628\u0627\u0644\u0641\u064A\u062A\u0627\u0645\u064A\u0646\u0627\u062A."
          },
          "price": "42",
          "image": "images/smoothie-energetic.webp"
        },
        {
          "name": {
            "fr": "MULTI-VITAMINE",
            "en": "MULTI-VITAMIN",
            "de": "MULTI-VITAMIN",
            "ar": "\u0633\u0645\u0648\u0630\u064A \u0645\u062A\u0639\u062F\u062F \u0627\u0644\u0641\u064A\u062A\u0627\u0645\u064A\u0646\u0627\u062A"
          },
          "description": {
            "fr": "Orange, p\xEAche, carotte.",
            "en": "Orange, peach, carrot.",
            "de": "Orange, Pfirsich, Karotte.",
            "ar": "\u0639\u0635\u064A\u0631 \u0628\u0631\u062A\u0642\u0627\u0644\u060C \u062E\u0648\u062E \u0637\u0628\u064A\u0639\u064A\u060C \u0648\u062C\u0632\u0631 \u0637\u0627\u0632\u062C \u063A\u0646\u064A \u0628\u0627\u0644\u0641\u0648\u0627\u0626\u062F \u0627\u0644\u0635\u062D\u064A\u0629."
          },
          "price": "42",
          "image": "images/smoothie-multiv.webp"
        },
        {
          "name": {
            "fr": "HAWAIEN",
            "en": "HAWAIIAN",
            "de": "HAWAIIAN",
            "ar": "\u0633\u0645\u0648\u0630\u064A \u0647\u0627\u0648\u0627\u064A \u0627\u0644\u0645\u0646\u0639\u0634"
          },
          "description": {
            "fr": "Fraise, ananas, kiwi, avocat, menthe.",
            "en": "Strawberry, pineapple, kiwi, avocado, mint.",
            "de": "Erdbeere, Ananas, Kiwi, Avocado, Minze.",
            "ar": "\u0641\u0631\u0627\u0648\u0644\u0629\u060C \u0623\u0646\u0627\u0646\u0627\u0633\u060C \u0643\u064A\u0648\u064A\u060C \u0623\u0641\u0648\u0643\u0627\u062F\u0648 \u0643\u0631\u064A\u0645\u064A\u060C \u0648\u0623\u0648\u0631\u0627\u0642 \u0627\u0644\u0646\u0639\u0646\u0627\u0639 \u0627\u0644\u0637\u0627\u0632\u062C\u0629."
          },
          "price": "42",
          "image": "images/smoothie-hawai.webp"
        }
      ]
    },
    {
      "category": {
        "fr": "SMOOTHIE \u2013 BOWL",
        "en": "SMOOTHIE BOWL",
        "de": "SMOOTHIE BOWL",
        "ar": "\u0633\u0645\u0648\u0630\u064A \u0628\u0648\u0644"
      },
      "items": [
        {
          "name": {
            "fr": "ULTRA \u2013 VITAMINES",
            "en": "ULTRA \u2013 VITAMINS",
            "de": "ULTRA \u2013 VITAMINE",
            "ar": "\u0633\u0645\u0648\u0630\u064A \u0628\u0648\u0644 \u0623\u0644\u062A\u0631\u0627 \u0641\u064A\u062A\u0627\u0645\u064A\u0646\u0627\u062A"
          },
          "description": {
            "fr": "Mangue, avocat, banane, citron, fraise, orange.",
            "en": "Mango, avocado, banana, lemon, strawberry, orange.",
            "de": "Mango, Avocado, Banane, Zitrone, Erdbeere, Orange.",
            "ar": "\u0645\u0627\u0646\u062C\u0648\u060C \u0623\u0641\u0648\u0643\u0627\u062F\u0648\u060C \u0645\u0648\u0632\u060C \u0644\u064A\u0645\u0648\u0646\u060C \u0641\u0631\u0627\u0648\u0644\u0629\u060C \u0648\u0628\u0631\u062A\u0642\u0627\u0644 \u0641\u064A \u0648\u0639\u0627\u0621 \u0633\u0645\u0648\u0630\u064A \u063A\u0646\u064A \u0648\u0645\u0632\u064A\u0646."
          },
          "price": "48",
          "image": "images/smoothiebowl-ultra.webp"
        },
        {
          "name": {
            "fr": "EXOTIQUE",
            "en": "EXOTIC",
            "de": "EXOTISCH",
            "ar": "\u0633\u0645\u0648\u0630\u064A \u0628\u0648\u0644 \u0627\u0633\u062A\u0648\u0627\u0626\u064A (\u0625\u0643\u0632\u0648\u062A\u064A\u0643)"
          },
          "description": {
            "fr": "Ananas, p\xEAche, mangue, banane, orange.",
            "en": "Pineapple, peach, mango, banana, orange.",
            "de": "Ananas, Pfirsich, Mango, Banane, Orange.",
            "ar": "\u0623\u0646\u0627\u0646\u0627\u0633\u060C \u062E\u0648\u062E\u060C \u0645\u0627\u0646\u062C\u0648\u060C \u0645\u0648\u0632\u060C \u0648\u0639\u0635\u064A\u0631 \u0628\u0631\u062A\u0642\u0627\u0644 \u0641\u064A \u0648\u0639\u0627\u0621 \u0633\u0645\u0648\u0630\u064A \u0645\u0646\u0639\u0634 \u0628\u0627\u0644\u0641\u0648\u0627\u0643\u0647."
          },
          "price": "48",
          "image": "images/smoothiebowl-exotic.webp"
        }
      ]
    },
    {
      "category": {
        "fr": "MILKSHAKES",
        "en": "MILKSHAKES",
        "de": "MILKSHAKES",
        "ar": "\u0645\u064A\u0644\u0643 \u0634\u064A\u0643"
      },
      "items": [
        {
          "name": {
            "fr": "MILKSHAKE FRAISE",
            "en": "STRAWBERRY MILKSHAKE",
            "de": "ERDBEER MILKSHAKE",
            "ar": "\u0645\u064A\u0644\u0643 \u0634\u064A\u0643 \u0641\u0631\u0627\u0648\u0644\u0629"
          },
          "description": {
            "fr": "Milkshake \xE0 la fraise.",
            "en": "Strawberry flavored milkshake.",
            "de": "Milkshake mit Erdbeergeschmack.",
            "ar": "\u0645\u064A\u0644\u0643 \u0634\u064A\u0643 \u0643\u0631\u064A\u0645\u064A \u0645\u062E\u0641\u0648\u0642 \u0628\u0627\u0644\u062D\u0644\u064A\u0628 \u0648\u0622\u064A\u0633 \u0643\u0631\u064A\u0645 \u0627\u0644\u0641\u0631\u0627\u0648\u0644\u0629 \u0648\u0635\u0644\u0635\u0629 \u0627\u0644\u0641\u0631\u0627\u0648\u0644\u0629 \u0627\u0644\u0644\u0630\u064A\u0630\u0629."
          },
          "price": "42",
          "image": "images/milkshake-fraise.webp"
        },
        {
          "name": {
            "fr": "MILKSHAKE CARAMEL",
            "en": "CARAMEL MILKSHAKE",
            "de": "KARAMELL MILKSHAKE",
            "ar": "\u0645\u064A\u0644\u0643 \u0634\u064A\u0643 \u0643\u0631\u0627\u0645\u064A\u0644"
          },
          "description": {
            "fr": "Milkshake au caramel.",
            "en": "Caramel flavored milkshake.",
            "de": "Milkshake mit Karamellgeschmack.",
            "ar": "\u0645\u064A\u0644\u0643 \u0634\u064A\u0643 \u0643\u0631\u064A\u0645\u064A \u0645\u062E\u0641\u0648\u0642 \u0628\u0627\u0644\u062D\u0644\u064A\u0628 \u0648\u0622\u064A\u0633 \u0643\u0631\u064A\u0645 \u0627\u0644\u0643\u0631\u0627\u0645\u064A\u0644 \u0645\u0639 \u0635\u0644\u0635\u0629 \u0627\u0644\u062A\u0648\u0641\u064A \u0627\u0644\u063A\u0646\u064A\u0629."
          },
          "price": "42",
          "image": "images/milkshake-caramel.webp"
        },
        {
          "name": {
            "fr": "MILKSHAKE CHOCOLAT",
            "en": "CHOCOLATE MILKSHAKE",
            "de": "SCHOKOLADEN MILKSHAKE",
            "ar": "\u0645\u064A\u0644\u0643 \u0634\u064A\u0643 \u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629"
          },
          "description": {
            "fr": "Milkshake au chocolat.",
            "en": "Chocolate flavored milkshake.",
            "de": "Milkshake mit Schokoladengeschmack.",
            "ar": "\u0645\u064A\u0644\u0643 \u0634\u064A\u0643 \u0643\u0631\u064A\u0645\u064A \u0645\u062E\u0641\u0648\u0642 \u0628\u0627\u0644\u062D\u0644\u064A\u0628 \u0648\u0622\u064A\u0633 \u0643\u0631\u064A\u0645 \u0627\u0644\u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629 \u0648\u0635\u0644\u0635\u0629 \u0627\u0644\u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629 \u0627\u0644\u0628\u0644\u062C\u064A\u0643\u064A\u0629."
          },
          "price": "42",
          "image": "images/milkshake-choc.webp"
        },
        {
          "name": {
            "fr": "MILKSHAKE VANILLE",
            "en": "VANILLA MILKSHAKE",
            "de": "VANILLE MILKSHAKE",
            "ar": "\u0645\u064A\u0644\u0643 \u0634\u064A\u0643 \u0641\u0627\u0646\u064A\u0644\u064A\u0627"
          },
          "description": {
            "fr": "Milkshake \xE0 la vanille.",
            "en": "Vanilla flavored milkshake.",
            "de": "Milkshake mit Vanillegeschmack.",
            "ar": "\u0645\u064A\u0644\u0643 \u0634\u064A\u0643 \u0643\u0631\u064A\u0645\u064A \u0643\u0644\u0627\u0633\u064A\u0643\u064A \u0645\u062E\u0641\u0648\u0642 \u0628\u0627\u0644\u062D\u0644\u064A\u0628 \u0627\u0644\u0637\u0628\u064A\u0639\u064A \u0648\u0622\u064A\u0633 \u0643\u0631\u064A\u0645 \u0627\u0644\u0641\u0627\u0646\u064A\u0644\u064A\u0627 \u0627\u0644\u0641\u0627\u062E\u0631\u0629."
          },
          "price": "42",
          "image": "images/milkshake-vanille.webp"
        },
        {
          "name": {
            "fr": "MILKSHAKE NUTELLA",
            "en": "NUTELLA MILKSHAKE",
            "de": "NUTELLA MILKSHAKE",
            "ar": "\u0645\u064A\u0644\u0643 \u0634\u064A\u0643 \u0646\u0648\u062A\u064A\u0644\u0627"
          },
          "description": {
            "fr": "Milkshake au Nutella.",
            "en": "Nutella flavored milkshake.",
            "de": "Milkshake mit Nutella-Geschmack.",
            "ar": "\u0645\u064A\u0644\u0643 \u0634\u064A\u0643 \u0643\u0631\u064A\u0645\u064A \u0645\u062E\u0641\u0648\u0642 \u0628\u0627\u0644\u062D\u0644\u064A\u0628 \u0648\u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629 \u0646\u0648\u062A\u064A\u0644\u0627 \u0627\u0644\u0623\u0635\u0644\u064A\u0629 \u0627\u0644\u063A\u0646\u064A\u0629 \u0628\u0627\u0644\u0628\u0646\u062F\u0642."
          },
          "price": "42",
          "image": "images/milkshake-nutella.webp"
        },
        {
          "name": {
            "fr": "SUPPL\xC9MENT CHANTILLY",
            "en": "WHIPPED CREAM SUPPLEMENT",
            "de": "SCHLAGSAHNE ZUSCHLAG",
            "ar": "\u0625\u0636\u0627\u0641\u0629 \u0643\u0631\u064A\u0645\u0629 \u0627\u0644\u0634\u0627\u0646\u062A\u064A\u064A"
          },
          "description": {
            "fr": "Ajout de cr\xE8me chantilly.",
            "en": "Addition of whipped cream.",
            "de": "Zusatz von Schlagsahne.",
            "ar": "\u0625\u0636\u0627\u0641\u0629 \u0637\u0628\u0642\u0629 \u0648\u0641\u064A\u0631\u0629 \u0645\u0646 \u0643\u0631\u064A\u0645\u0629 \u0627\u0644\u0634\u0627\u0646\u062A\u064A\u064A \u0627\u0644\u0645\u062E\u0641\u0648\u0642\u0629 \u0627\u0644\u0637\u0627\u0632\u062C\u0629 \u0648\u0627\u0644\u0644\u0630\u064A\u0630\u0629."
          },
          "price": "05",
          "image": "images/milkshake-chant.webp"
        }
      ]
    },
    {
      "category": {
        "fr": "COUPE DE GLACE",
        "en": "ICE CREAM CUPS",
        "de": "EISBECHER",
        "ar": "\u0645\u062B\u0644\u062C\u0627\u062A (\u0622\u064A\u0633 \u0643\u0631\u064A\u0645)"
      },
      "id": "glace",
      "items": [
        {
          "name": {
            "fr": "COUPE GREY CORNER",
            "en": "GREY CORNER CUP",
            "de": "GREY CORNER BECHER",
            "ar": "\u0643\u0623\u0633 \u0645\u062B\u0644\u062C\u0627\u062A \u063A\u0631\u064A \u0643\u0648\u0631\u0646\u0631 \u0627\u0644\u062E\u0627\u0635"
          },
          "description": {
            "fr": "Vanille, nougat, yaourt,pistache.",
            "en": "Vanilla, nougat, yogurt,pistachio.",
            "de": "Vanille, Nougat, Waldbeerjoghurt,pistazie.",
            "ar": "\u0641\u0627\u0646\u064A\u0644\u064A\u0627\u060C \u0646\u0648\u063A\u0627\u060C \u0632\u0628\u0627\u062F\u064A \u0628\u0627\u0644\u0641\u0648\u0627\u0643\u0647 (\u064A\u0627\u063A\u0648\u0631\u062A)\u060C \u0648\u0641\u0633\u062A\u0642 \u062D\u0644\u0628\u064A \u0645\u0639 \u0627\u0644\u062A\u0632\u064A\u064A\u0646 \u0627\u0644\u0631\u0627\u0642\u064A."
          },
          "price": "65",
          "image": "images/glace-gc.webp"
        },
        {
          "name": {
            "fr": "COUPE AMOR",
            "en": "AMOR CUP",
            "de": "AMOR BECHER",
            "ar": "\u0643\u0623\u0633 \u0645\u062B\u0644\u062C\u0627\u062A \u0623\u0645\u0648\u0631"
          },
          "description": {
            "fr": "Fraise, yaourt,nougat.",
            "en": "Strawberry, yogurt, nougat.",
            "de": "Erdbeere, Joghurt, nougat.",
            "ar": "\u0645\u062B\u0644\u062C\u0627\u062A \u0627\u0644\u0641\u0631\u0627\u0648\u0644\u0629\u060C \u0632\u0628\u0627\u062F\u064A\u060C\u0648\u0646\u0648\u063A\u0627 \u0645\u0639 \u0627\u0644\u062A\u0632\u064A\u064A\u0646 \u0648\u0635\u0644\u0635\u0629 \u0627\u0644\u0641\u0648\u0627\u0643\u0647."
          },
          "price": "45",
          "image": "images/glace-amor.webp"
        },
        {
          "name": {
            "fr": "COUPE ENFANT",
            "en": "KIDS CUP",
            "de": "KINDERBECHER",
            "ar": "\u0643\u0623\u0633 \u0645\u062B\u0644\u062C\u0627\u062A \u0627\u0644\u0623\u0637\u0641\u0627\u0644"
          },
          "description": {
            "fr": "chocolat, bubble, Chantilly.",
            "en": "chocolate, bubble, whipped cream.",
            "de": "schokolade, Bubble, Schlagsahne.",
            "ar": "\u0645\u062B\u0644\u062C\u0627\u062A \u0627\u0644\u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629\u060C \u0628\u0627\u0628\u0644 \u063A\u0627\u0645\u060C \u0648\u0643\u0631\u064A\u0645\u0629 \u0627\u0644\u0634\u0627\u0646\u062A\u064A\u064A \u0645\u0639 \u062D\u0644\u0648\u0649 \u0645\u0644\u0648\u0646\u0629."
          },
          "price": "40",
          "image": "images/glace-enfant.webp"
        },
        {
          "name": {
            "fr": "2 Boules de glace",
            "en": "2 Scoops of Ice Cream",
            "de": "2 Kugeln Eis",
            "ar": "\u0643\u0631\u062A\u0627\u0646 \u0645\u0646 \u0627\u0644\u0645\u062B\u0644\u062C\u0627\u062A (\u0622\u064A\u0633 \u0643\u0631\u064A\u0645)"
          },
          "description": {
            "fr": "Parfums au choix : Vanille, chocolat, nougat, pistache, bubble, yaourt fruit des bois, fraise, caramel.",
            "en": "Flavors of choice: Vanilla, chocolate, nougat, pitachio, bubble, forest fruit yogurt, strawberry, caramel.",
            "de": "Geschmacksrichtungen nach Wahl: Vanille, Schokolade, Nougat, pistazie, Bubble, Waldbeerjoghurt, Erdbeere, Karamell.",
            "ar": "\u0646\u0643\u0647\u062A\u0627\u0646 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643: \u0641\u0627\u0646\u064A\u0644\u064A\u0627\u060C \u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629\u060C \u0646\u0648\u063A\u0627\u060C \u0641\u0633\u062A\u0642\u060C \u0628\u0627\u0628\u0644\u060C \u0632\u0628\u0627\u062F\u064A \u0641\u0648\u0627\u0643\u0647 \u0627\u0644\u063A\u0627\u0628\u0629\u060C \u0641\u0631\u0627\u0648\u0644\u0629\u060C \u0623\u0648 \u0643\u0631\u0627\u0645\u064A\u0644."
          },
          "price": "30",
          "image": "images/glace-2boules.webp"
        },
        {
          "name": {
            "fr": "1 Boule de glace",
            "en": "1 Scoop of Ice Cream",
            "de": "1 Kugel Eis",
            "ar": "\u0643\u0631\u0629 \u0648\u0627\u062D\u062F\u0629 \u0645\u0646 \u0627\u0644\u0645\u062B\u0644\u062C\u0627\u062A (\u0622\u064A\u0633 \u0643\u0631\u064A\u0645)"
          },
          "description": {
            "fr": "Parfum au choix : Vanille, chocolat, nougat, pitache, bubble, yaourt fruit des bois, fraise, caramel.",
            "en": "Flavor of choice: Vanilla, chocolate, nougat, pistachio, bubble, forest fruit yogurt, strawberry, caramel.",
            "de": "Geschmack nach Wahl: Vanille, Schokolade, Nougat, pistazie, Bubble, Waldbeerjoghurt, Erdbeere, Karamell.",
            "ar": "\u0646\u0643\u0647\u0629 \u0648\u0627\u062D\u062F\u0629 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643: \u0641\u0627\u0646\u064A\u0644\u064A\u0627\u060C \u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629\u060C \u0646\u0648\u063A\u0627\u060C \u0641\u0633\u062A\u0642\u060C \u0628\u0627\u0628\u0644\u060C \u0632\u0628\u0627\u062F\u064A \u0641\u0648\u0627\u0643\u0647 \u0627\u0644\u063A\u0627\u0628\u0629\u060C \u0641\u0631\u0627\u0648\u0644\u0629\u060C \u0623\u0648 \u0643\u0631\u0627\u0645\u064A\u0644."
          },
          "price": "16",
          "image": "images/glace-1boule.webp"
        }
      ]
    }
  ];

  // js/services/i18n.js
  function detectPhoneLanguage() {
    const userLangs = navigator.languages || [navigator.language || navigator.userLanguage || ""];
    for (const l of userLangs) {
      const code = (l || "").toLowerCase();
      if (code.startsWith("ar")) return "ar";
      if (code.startsWith("en")) return "en";
      if (code.startsWith("de")) return "de";
      if (code.startsWith("fr")) return "fr";
    }
    return "fr";
  }
  var manualLang = sessionStorage.getItem("manual_lang");
  var currentLang = manualLang || detectPhoneLanguage();
  var PRIX_TEXTS = {
    fr: "\u2605 Tous les prix sont en dirhams marocains (MAD)",
    en: "\u2605 All prices are in Moroccan Dirhams (MAD)",
    de: "\u2605 Alle Preise sind in Marokkanischen Dirham (MAD)",
    ar: "\u2605 \u062C\u0645\u064A\u0639 \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0628\u0627\u0644\u062F\u0631\u0647\u0645 \u0627\u0644\u0645\u063A\u0631\u0628\u064A (MAD)"
  };
  function applyLanguageToStaticTexts() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const value = el.getAttribute(`data-${currentLang}`) || el.getAttribute("data-fr");
      if (value !== null) el.textContent = value;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const value = el.getAttribute(`data-placeholder-${currentLang}`) || el.getAttribute("data-placeholder-fr");
      if (value !== null) el.placeholder = value;
    });
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      const placeholders = {
        fr: "Rechercher un plat...",
        en: "Search a dish...",
        de: "Gericht suchen...",
        ar: "\u0627\u0628\u062D\u062B \u0639\u0646 \u0637\u0628\u0642..."
      };
      searchInput.placeholder = placeholders[currentLang] || placeholders.fr;
    }
  }
  function setLanguage(lang) {
    if (["fr", "en", "de", "ar"].includes(lang)) {
      currentLang = lang;
      window.currentLang = lang;
      sessionStorage.setItem("manual_lang", lang);
      localStorage.setItem("lang", lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      document.documentElement.classList.toggle("rtl-mode", lang === "ar");
      applyLanguageToStaticTexts();
      updatePrixInfo();
      if (typeof window.updateFeedbackTexts === "function") {
        window.updateFeedbackTexts();
      }
      return true;
    }
    return false;
  }
  function updatePrixInfo() {
    const el = document.getElementById("prixInfo");
    if (el) el.textContent = PRIX_TEXTS[currentLang] || PRIX_TEXTS.fr;
  }
  window.currentLang = currentLang;
  window.setLanguage = setLanguage;
  window.updatePrixInfo = updatePrixInfo;
  window.applyLanguageToStaticTexts = applyLanguageToStaticTexts;

  // js/services/gps.js
  var GeoFenceManager = {
    CENTER_LAT: 34.0344054,
    CENTER_LNG: -5.0154828,
    ALLOWED_RADIUS: 65,
    // meters (adjusted with tolerance for indoor reception)
    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371e3;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
    isWithinGeofence(lat, lng, accuracy = 0) {
      const dist = this.calculateDistance(this.CENTER_LAT, this.CENTER_LNG, lat, lng);
      console.log(`\u{1F4CF} Distance to Grey Corner center: ${dist.toFixed(1)} meters (accuracy: \xB1${(accuracy || 0).toFixed(1)}m).`);
      const effectiveDist = Math.max(0, dist - Math.min(accuracy || 0, 25));
      return effectiveDist <= this.ALLOWED_RADIUS;
    }
  };
  var LocationSecurityManager = {
    lastCoords: null,
    lastTimestamp: null,
    isMockLocation(coords) {
      if (coords.accuracy === 0) {
        console.warn("\u26A0\uFE0F GPS Security Warning: Accuracy of 0 is suspicious (Mocked GPS).");
        return true;
      }
      if (this.lastCoords && this.lastTimestamp) {
        const timeDiff = (Date.now() - this.lastTimestamp) / 1e3;
        if (timeDiff > 0) {
          const distanceMoved = GeoFenceManager.calculateDistance(
            this.lastCoords.latitude,
            this.lastCoords.longitude,
            coords.latitude,
            coords.longitude
          );
          const speedKmh = distanceMoved / timeDiff * 3.6;
          if (distanceMoved > 150 && speedKmh > 300) {
            console.warn(`\u26A0\uFE0F GPS Security Warning: Teleportation detected at ${speedKmh.toFixed(1)} km/h.`);
            return true;
          }
        }
      }
      this.lastCoords = { latitude: coords.latitude, longitude: coords.longitude };
      this.lastTimestamp = Date.now();
      return false;
    }
  };
  var GPSService = {
    isInside: false,
    isSuspicious: false,
    permissionState: "prompt",
    timer: null,
    init() {
      console.log("\u{1F6F0}\uFE0F Initializing GPSService...");
      this.checkLocation(true);
      this.timer = setInterval(() => {
        if (document.visibilityState === "visible") {
          this.checkLocation(false);
        }
      }, 3e4);
    },
    checkLocation(isStartup = false, callback = null) {
      if (!navigator.geolocation) {
        this.handleError("Not compatible");
        if (callback) callback(false);
        return;
      }
      const options = {
        enableHighAccuracy: true,
        timeout: 1e4,
        maximumAge: 0
      };
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = position.coords;
          this.permissionState = "granted";
          if (LocationSecurityManager.isMockLocation(coords)) {
            this.isSuspicious = true;
            this.isInside = false;
            this.updateUI("suspect");
            if (callback) callback(false);
            return;
          }
          this.isSuspicious = false;
          const inside = GeoFenceManager.isWithinGeofence(coords.latitude, coords.longitude, coords.accuracy);
          this.isInside = inside;
          if (inside) {
            this.updateUI("inside");
            if (callback) callback(true);
          } else {
            this.updateUI("outside");
            if (callback) callback(false);
          }
        },
        (error) => {
          console.warn("\u26A0\uFE0F GPS Location query failed:", error.message);
          if (error.code === error.PERMISSION_DENIED) {
            this.permissionState = "denied";
          }
          this.handleError(error.message);
          if (callback) callback(false);
        },
        options
      );
    },
    handleError(msg) {
      this.isInside = false;
      if (this.permissionState === "denied") {
        this.updateUI("denied");
      } else {
        this.updateUI("error");
      }
    },
    updateUI(state) {
      const badge = document.getElementById("gpsStatusBadge");
      const text = document.getElementById("gpsStatusText");
      if (!badge || !text) return;
      badge.className = "gps-status-badge";
      const textMap = {
        fr: {
          inside: "Chez Grey Corner F\xE8s",
          outside: "Mode consultation uniquement",
          suspect: "Position GPS suspecte !",
          denied: "Autoriser le GPS pour commander",
          error: "Erreur GPS. V\xE9rifiez vos r\xE9glages"
        },
        en: {
          inside: "At Grey Corner F\xE8s",
          outside: "Read-only Menu",
          suspect: "Invalid GPS position !",
          denied: "Allow GPS to interact",
          error: "GPS Error. Check settings"
        },
        de: {
          inside: "Bei Grey Corner F\xE8s",
          outside: "Nur Lese-Men\xFC",
          suspect: "Ung\xFCltige GPS-Position !",
          denied: "GPS erlauben zum Bestellen",
          error: "GPS-Fehler. Einstellungen pr\xFCfen"
        },
        ar: {
          inside: "\u0641\u064A \u063A\u0631\u064A \u0643\u0648\u0631\u0646\u0631 \u0641\u0627\u0633",
          outside: "\u0648\u0636\u0639 \u0627\u0644\u062A\u0635\u0641\u062D \u0641\u0642\u0637",
          suspect: "\u0645\u0648\u0642\u0639 GPS \u063A\u064A\u0631 \u062F\u0642\u064A\u0642 !",
          denied: "\u064A\u0631\u062C\u0649 \u062A\u0641\u0639\u064A\u0644 GPS \u0644\u0644\u0637\u0644\u0628",
          error: "\u062E\u0637\u0623 \u0641\u064A \u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0645\u0648\u0642\u0639"
        }
      };
      this.lastState = state;
      const currentLangTexts = textMap[currentLang] || textMap.fr;
      if (state === "inside") {
        badge.classList.add("gps-inside");
        text.textContent = currentLangTexts.inside;
        this.toggleInteractiveControls(true);
        window._GC_modalShown = true;
        window.GC_isPreorder = false;
        if (typeof window.GC_hidePreorderModal === "function") window.GC_hidePreorderModal();
        if (typeof window.GC_hideGpsBlocked === "function") window.GC_hideGpsBlocked();
      } else if (state === "outside") {
        if (window.GC_isPreorder) {
          if (typeof window.GC_applyPreorderUI === "function") window.GC_applyPreorderUI();
        } else {
          badge.classList.add("gps-outside");
          text.textContent = currentLangTexts.outside;
          this.toggleInteractiveControls(false);
          if (!window._GC_modalShown && typeof window.GC_showPreorderModal === "function") {
            window._GC_modalShown = true;
            window.GC_showPreorderModal();
          }
        }
      } else if (state === "suspect") {
        badge.classList.add("gps-suspect");
        text.textContent = currentLangTexts.suspect;
        this.toggleInteractiveControls(false);
      } else if (state === "denied") {
        badge.classList.add("gps-denied");
        text.textContent = currentLangTexts.denied;
        this.toggleInteractiveControls(false);
        if (!window._GC_gpsBlockedShown && typeof window.GC_showGpsBlocked === "function") {
          window._GC_gpsBlockedShown = true;
          window.GC_showGpsBlocked();
        }
      } else {
        badge.classList.add("gps-error");
        text.textContent = currentLangTexts.error;
        this.toggleInteractiveControls(false);
        if (!window._GC_gpsBlockedShown && typeof window.GC_showGpsBlocked === "function") {
          window._GC_gpsBlockedShown = true;
          window.GC_showGpsBlocked();
        }
      }
    },
    toggleInteractiveControls(enable) {
      const cabCall = document.getElementById("cabCallWaiter");
      const cabWater = document.getElementById("cabRequestWater");
      const cabBill = document.getElementById("cabRequestBill");
      const cdSubmit = document.getElementById("cdSubmitBtn");
      [cabCall, cabWater, cabBill].forEach((btn) => {
        if (!btn) return;
        if (enable) {
          btn.classList.remove("disabled-gps");
        } else {
          btn.classList.add("disabled-gps");
        }
      });
      if (cdSubmit) {
        if (enable || window.GC_isPreorder) {
          cdSubmit.classList.remove("disabled-gps");
          cdSubmit.disabled = false;
          cdSubmit.removeAttribute("disabled");
        } else {
          cdSubmit.classList.add("disabled-gps");
        }
      }
      const actionBar = document.getElementById("clientActionBar");
      if (actionBar) {
        actionBar.style.display = "block";
      }
    }
  };
  window.GeoFenceManager = GeoFenceManager;
  window.LocationSecurityManager = LocationSecurityManager;
  window.GPSService = GPSService;

  // js/services/cart.js
  var clientCart = [];
  function initClientCart() {
    clientCart.length = 0;
    try {
      const items = JSON.parse(localStorage.getItem("grey_cart") || "[]");
      if (Array.isArray(items)) {
        items.forEach((item) => clientCart.push(item));
      }
    } catch (e) {
      clientCart.length = 0;
    }
    updateCartUI();
  }
  function saveClientCart() {
    localStorage.setItem("grey_cart", JSON.stringify(clientCart));
    updateCartUI();
  }
  function clearCart() {
    clientCart.length = 0;
    saveClientCart();
  }
  function showToast(message) {
    let toast = document.getElementById("toastNotification");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toastNotification";
      toast.className = "toast-notification";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }
  function addToCart(menuItem, choices = null) {
    let cartItemId = menuItem.name.fr;
    if (choices && choices.length > 0) {
      cartItemId += `_${choices.join("_")}`;
    }
    const existingIndex = clientCart.findIndex((item) => item.id === cartItemId);
    if (existingIndex !== -1) {
      clientCart[existingIndex].qty += 1;
    } else {
      clientCart.push({
        id: cartItemId,
        name: menuItem.name,
        categoryNameFr: menuItem.categoryNameFr || "",
        price: parseFloat(menuItem.price) || 0,
        image: menuItem.image,
        qty: 1,
        note: "",
        drinkChoices: choices
      });
    }
    saveClientCart();
    const toastMsgs = {
      fr: "Ajout\xE9 au panier !",
      en: "Added to basket !",
      de: "In den Korb gelegt !",
      ar: "\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u062A\u0647 \u0625\u0644\u0649 \u0627\u0644\u0633\u0644\u0629 !"
    };
    const choicesStr = choices && choices.length > 0 ? ` (${choices.join(", ")})` : "";
    showToast(`${menuItem.name[currentLang] || menuItem.name.fr}${choicesStr} \u2014 ${toastMsgs[currentLang] || toastMsgs.fr}`);
  }
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
        clientCart.forEach((item) => {
          const itemDiv = document.createElement("div");
          itemDiv.className = "cd-item";
          const isDrinkItem = item.categoryNameFr && (item.categoryNameFr.toLowerCase().includes("boisson") || item.categoryNameFr.toLowerCase().includes("petit-d") || item.categoryNameFr.toLowerCase().includes("caf\xE9"));
          const choiceIcon = isDrinkItem ? "\u2615" : "\u{1F37D}\uFE0F";
          const drinkChoicesStr = item.drinkChoices && item.drinkChoices.length > 0 ? `<div style="font-size:0.75rem; color:var(--sc-gold-light); margin-top:2px;">${choiceIcon} ${item.drinkChoices.join(", ")}</div>` : "";
          itemDiv.innerHTML = `
          <div class="cd-item-img" style="background-image: url('${item.image}')"></div>
          <div class="cd-item-details">
            <h4 class="cd-item-name">${item.name[currentLang] || item.name.fr || item.name}</h4>
            ${drinkChoicesStr}
            <span class="cd-item-price">${item.price * item.qty} MAD</span>
          </div>
          <div class="cd-item-actions">
            <div class="cd-qty-wrap">
              <button class="cd-qty-btn cd-dec" data-id="${item.id}">-</button>
              <span class="cd-qty-num">${item.qty}</span>
              <button class="cd-qty-btn cd-inc" data-id="${item.id}">+</button>
            </div>
            <button class="cd-remove-btn" data-id="${item.id}" title="Supprimer">\u{1F5D1}\uFE0F</button>
          </div>
        `;
          itemDiv.querySelector(".cd-dec").addEventListener("click", () => {
            const idx = clientCart.findIndex((c) => c.id === item.id);
            if (idx !== -1) {
              if (clientCart[idx].qty > 1) {
                clientCart[idx].qty -= 1;
              } else {
                clientCart.splice(idx, 1);
              }
              saveClientCart();
            }
          });
          itemDiv.querySelector(".cd-inc").addEventListener("click", () => {
            const idx = clientCart.findIndex((c) => c.id === item.id);
            if (idx !== -1) {
              clientCart[idx].qty += 1;
              saveClientCart();
            }
          });
          itemDiv.querySelector(".cd-remove-btn").addEventListener("click", () => {
            const idx = clientCart.findIndex((c) => c.id === item.id);
            if (idx !== -1) {
              clientCart.splice(idx, 1);
              saveClientCart();
            }
          });
          cdItemsList.appendChild(itemDiv);
        });
        const totalPrice = clientCart.reduce((sum, item) => sum + item.price * item.qty, 0);
        if (cdTotalPrice) cdTotalPrice.textContent = `${totalPrice} MAD`;
      }
    }
  }
  window.clientCart = clientCart;
  window.initClientCart = initClientCart;
  window.saveClientCart = saveClientCart;
  window.clearCart = clearCart;
  window.addToCart = addToCart;
  window.updateCartUI = updateCartUI;
  window.showToast = showToast;

  // js/ui/modals.js
  var clientTable = null;
  var pendingActionAfterTableSelect = null;
  var HOT_DRINKS_OPTIONS = [
    { fr: "Caf\xE9 S\xE9par\xE9", en: "Separated Coffee", de: "Getrennter Kaffee", ar: "\u0642\u0647\u0648\u0629 \u0645\u0641\u0635\u0648\u0644\u0629" },
    { fr: "Lait Froid", en: "Cold Milk", de: "Kalte Milch", ar: "\u062D\u0644\u064A\u0628 \u0628\u0627\u0631\u062F" },
    { fr: "Lait Chaud", en: "Hot Milk", de: "Warme Milch", ar: "\u062D\u0644\u064A\u0628 \u0633\u0627\u062E\u0646" },
    { fr: "Caf\xE9 Noir", en: "Black Coffee", de: "Schwarzer Kaffee", ar: "\u0642\u0647\u0648\u0629 \u0633\u0648\u062F\u0627\u0621" },
    { fr: "Cappuccino Italien", en: "Italian Cappuccino", de: "Italienischer Cappuccino", ar: "\u0643\u0627\u0628\u062A\u0634\u064A\u0646\u0648 \u0625\u064A\u0637\u0627\u0644\u064A" },
    { fr: "Caf\xE9 Cass\xE9", en: "Caf\xE9 Cass\xE9", de: "Caf\xE9 Cass\xE9", ar: "\u0642\u0647\u0648\u0629 \u0645\u0643\u0633\u0648\u0631\u0629 (\u0643\u0627\u0633\u064A)" },
    { fr: "Jus d'Orange", en: "Orange Juice", de: "Orangensaft", ar: "\u0639\u0635\u064A\u0631 \u0628\u0631\u062A\u0642\u0627\u0644" },
    { fr: "Lait Cass\xE9", en: "Lait Cass\xE9", de: "Lait Cass\xE9", ar: "\u062D\u0644\u064A\u0628 \u0645\u0643\u0633\u0648\u0631" },
    { fr: "Caf\xE9 Moiti\xE9", en: "Half Coffee", de: "Halber Kaffee", ar: "\u0642\u0647\u0648\u0629 \u0646\u0635\u0641 \u0646\u0635\u0641" },
    { fr: "Chocolat au Lait", en: "Milk Chocolate", de: "Milchschokolade", ar: "\u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629 \u0628\u0627\u0644\u062D\u0644\u064A\u0628" },
    { fr: "Caf\xE9 Am\xE9ricain", en: "Americano Coffee", de: "Kaffee Americano", ar: "\u0642\u0647\u0648\u0629 \u0623\u0645\u0631\u064A\u0643\u064A\u0629" },
    { fr: "Caf\xE9 au Lait", en: "Coffee with Milk", de: "Milchkaffee", ar: "\u0642\u0647\u0648\u0629 \u0628\u0627\u0644\u062D\u0644\u064A\u0628" },
    { fr: "Th\xE9 \xE0 la Menthe", en: "Mint Tea", de: "Minztee", ar: "\u0634\u0627\u064A \u0645\u063A\u0631\u0628\u064A \u0628\u0627\u0644\u0646\u0639\u0646\u0627\u0639" },
    { fr: "Th\xE9 Noir", en: "Black Tea", de: "Schwarzer Tee", ar: "\u0634\u0627\u064A \u0623\u0633\u0648\u062F" },
    { fr: "Th\xE9 Noir au Lait", en: "Black Tea with Milk", de: "Schwarzer Tee mit Milch", ar: "\u0634\u0627\u064A \u0623\u0633\u0648\u062F \u0628\u0627\u0644\u062D\u0644\u064A\u0628" },
    { fr: "Verveine", en: "Verbena Infusion", de: "Eisenkraut Tee", ar: "\u0644\u0648\u064A\u0632\u0629" }
  ];
  var SIDES_OPTIONS = [
    { fr: "L\xE9gumes saut\xE9s", en: "Saut\xE9ed vegetables", de: "Sautiertes Gem\xFCse", ar: "\u062E\u0636\u0627\u0631 \u0633\u0648\u062A\u064A\u0647" },
    { fr: "Riz", en: "Rice", de: "Reis", ar: "\u0623\u0631\u0632" },
    { fr: "Frites", en: "French Fries", de: "Pommes Frites", ar: "\u0628\u0637\u0627\u0637\u0633 \u0645\u0642\u0644\u064A\u0629" },
    { fr: "Pur\xE9e pomme de terre", en: "Mashed potatoes", de: "Kartoffelp\xFCree", ar: "\u0628\u0637\u0627\u0637\u0633 \u0645\u0647\u0631\u0648\u0633\u0629 (\u0628\u0648\u0631\u064A\u0647)" },
    { fr: "Potatos", en: "Potato Wedges", de: "Spaltenkartoffeln", ar: "\u0628\u0637\u0627\u0637\u0633 \u0648\u064A\u062F\u062C\u0632 (\u0628\u0648\u062A\u0627\u062A\u0648\u0633)" }
  ];
  var PASTA_OPTIONS = [
    { fr: "Rigatoni", en: "Rigatoni", de: "Rigatoni", ar: "\u0631\u064A\u063A\u0627\u062A\u0648\u0646\u064A" },
    { fr: "Tagliatelles", en: "Tagliatelle", de: "Tagliatelle", ar: "\u062A\u0627\u0644\u064A\u0627\u062A\u064A\u0644\u064A" },
    { fr: "Spaghettis", en: "Spaghetti", de: "Spaghetti", ar: "\u0633\u0628\u0627\u063A\u064A\u062A\u064A" },
    { fr: "Linguines", en: "Linguine", de: "Linguine", ar: "\u0644\u064A\u0646\u063A\u0648\u064A\u0646\u064A" }
  ];
  var selectedOptionMenuItem = null;
  function renderOptionList(listContainerId, counterId, confirmBtnId, optionsArray, limit, modalEl) {
    const listContainer = document.getElementById(listContainerId);
    if (!listContainer) return;
    listContainer.innerHTML = "";
    const counts = {};
    optionsArray.forEach((_, idx) => {
      counts[idx] = 0;
    });
    function updateListUI() {
      const totalSelected = Object.values(counts).reduce((a, b) => a + b, 0);
      const counterEl = document.getElementById(counterId);
      const counterTexts = {
        fr: `S\xE9lection : ${totalSelected} / ${limit}`,
        en: `Selection: ${totalSelected} / ${limit}`,
        de: `Auswahl: ${totalSelected} / ${limit}`,
        ar: `\u0627\u0644\u0645\u062D\u062F\u062F: ${totalSelected} / ${limit}`
      };
      if (counterEl) {
        counterEl.textContent = counterTexts[currentLang] || counterTexts.fr;
      }
      const confirmBtn2 = document.getElementById(confirmBtnId);
      if (confirmBtn2) {
        confirmBtn2.disabled = totalSelected !== limit;
      }
      optionsArray.forEach((opt, idx) => {
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
          if (decBtn) decBtn.disabled = countVal === 0;
          if (incBtn) incBtn.disabled = totalSelected >= limit;
        }
      });
    }
    optionsArray.forEach((opt, idx) => {
      const item = document.createElement("div");
      item.className = "hdo-item";
      item.dataset.index = idx;
      item.innerHTML = `
      <div class="hdo-name">${opt[currentLang] || opt.fr}</div>
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
        const totalSelected = Object.values(counts).reduce((a, b) => a + b, 0);
        if (totalSelected < limit) {
          counts[idx]++;
          updateListUI();
        } else if (limit === 1) {
          optionsArray.forEach((_, i) => {
            counts[i] = 0;
          });
          counts[idx] = 1;
          updateListUI();
        }
      });
      listContainer.appendChild(item);
    });
    updateListUI();
    const confirmBtn = document.getElementById(confirmBtnId);
    if (confirmBtn) {
      confirmBtn.onclick = () => {
        const finalChoices = [];
        optionsArray.forEach((opt, idx) => {
          const qty = counts[idx];
          for (let k = 0; k < qty; k++) {
            finalChoices.push(opt[currentLang] || opt.fr);
          }
        });
        if (modalEl) modalEl.style.display = "none";
        if (selectedOptionMenuItem) {
          addToCart(selectedOptionMenuItem, finalChoices);
        }
      };
    }
  }
  function openHotDrinkSelectorModal(menuItem) {
    selectedOptionMenuItem = menuItem;
    const modal = document.getElementById("hotDrinkModalOverlay");
    if (!modal) return;
    modal.style.display = "flex";
    const isBrunchDuo = menuItem.name && menuItem.name.fr === "BRUNCH DUO";
    const limit = isBrunchDuo ? 2 : 1;
    const titleEl = document.getElementById("hotDrinkModalTitle");
    const subtitleEl = document.getElementById("hotDrinkModalSubtitle");
    const titles = {
      fr: isBrunchDuo ? "S\xE9lectionnez 2 Boissons Chaudes" : "Choisissez votre Boisson Chaude",
      en: isBrunchDuo ? "Select 2 Hot Beverages" : "Choose Your Hot Beverage",
      de: isBrunchDuo ? "W\xE4hlen Sie 2 Hei\xDFgetr\xE4nke" : "W\xE4hlen Sie Ihr Hei\xDFgetr\xE4nk",
      ar: isBrunchDuo ? "\u0627\u062E\u062A\u0631 \u0645\u0634\u0631\u0648\u0628\u064A\u0646 \u0633\u0627\u062E\u0646\u064A\u0646" : "\u0627\u062E\u062A\u0631 \u0645\u0634\u0631\u0648\u0628\u0643 \u0627\u0644\u0633\u0627\u062E\u0646"
    };
    const subtitles = {
      fr: `Votre menu "${menuItem.name[currentLang] || menuItem.name.fr}" comprend ${limit} boisson(s) chaude(s) au choix.`,
      en: `Your "${menuItem.name[currentLang] || menuItem.name.fr}" menu includes ${limit} choice(s) of hot beverage.`,
      de: `Ihr Men\xFC "${menuItem.name[currentLang] || menuItem.name.fr}" beinhaltet ${limit} Hei\xDFgetr\xE4nk(e) nach Wahl.`,
      ar: `\u0642\u0627\u0626\u0645\u062A\u0643 "${menuItem.name[currentLang] || menuItem.name.fr}" \u062A\u062A\u0636\u0645\u0646 ${limit} \u0645\u0634\u0631\u0648\u0628(\u0627\u062A) \u0633\u0627\u062E\u0646\u0629 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643.`
    };
    if (titleEl) titleEl.textContent = titles[currentLang] || titles.fr;
    if (subtitleEl) subtitleEl.textContent = subtitles[currentLang] || subtitles.fr;
    const closeBtn = document.getElementById("hotDrinkCloseBtn");
    if (closeBtn) {
      closeBtn.onclick = () => {
        modal.style.display = "none";
      };
    }
    renderOptionList("hotDrinksList", "hotDrinkCounter", "hotDrinkConfirmBtn", HOT_DRINKS_OPTIONS, limit, modal);
  }
  function openSidesSelectorModal(menuItem) {
    selectedOptionMenuItem = menuItem;
    const modal = document.getElementById("sidesModalOverlay");
    if (!modal) return;
    modal.style.display = "flex";
    const limit = 2;
    const titleEl = document.getElementById("sidesModalTitle");
    const subtitleEl = document.getElementById("sidesModalSubtitle");
    const titles = {
      fr: "Choisissez 2 Accompagnements",
      en: "Choose 2 Accompaniments",
      de: "W\xE4hlen Sie 2 Beilagen",
      ar: "\u0627\u062E\u062A\u0631 \u0645\u0631\u0627\u0641\u0642\u062A\u064A\u0646"
    };
    const subtitles = {
      fr: `Veuillez s\xE9lectionner 2 accompagnements de votre choix pour "${menuItem.name[currentLang] || menuItem.name.fr}".`,
      en: `Please select 2 accompaniments of your choice for "${menuItem.name[currentLang] || menuItem.name.fr}".`,
      de: `Bitte w\xE4hlen Sie 2 Beilagen Ihrer Wahl f\xFCr "${menuItem.name[currentLang] || menuItem.name.fr}".`,
      ar: `\u064A\u0631\u062C\u0649 \u0627\u062E\u062A\u064A\u0627\u0631 \u0645\u0631\u0627\u0641\u0642\u062A\u064A\u0646 \u0645\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643 \u0644\u0637\u0628\u0642 "${menuItem.name[currentLang] || menuItem.name.fr}".`
    };
    if (titleEl) titleEl.textContent = titles[currentLang] || titles.fr;
    if (subtitleEl) subtitleEl.textContent = subtitles[currentLang] || subtitles.fr;
    const closeBtn = document.getElementById("sidesCloseBtn");
    if (closeBtn) {
      closeBtn.onclick = () => {
        modal.style.display = "none";
      };
    }
    renderOptionList("sidesList", "sidesCounter", "sidesConfirmBtn", SIDES_OPTIONS, limit, modal);
  }
  function openPastaSelectorModal(menuItem) {
    selectedOptionMenuItem = menuItem;
    const modal = document.getElementById("pastaModalOverlay");
    if (!modal) return;
    modal.style.display = "flex";
    const limit = 1;
    const titleEl = document.getElementById("pastaModalTitle");
    const subtitleEl = document.getElementById("pastaModalSubtitle");
    const titles = {
      fr: "Choisissez votre type de p\xE2tes",
      en: "Choose your type of pasta",
      de: "W\xE4hlen Sie Ihre Nudelsorte",
      ar: "\u0627\u062E\u062A\u0631 \u0646\u0648\u0639 \u0627\u0644\u0645\u0639\u0643\u0631\u0648\u0646\u0629"
    };
    const subtitles = {
      fr: `Veuillez s\xE9lectionner le type de p\xE2tes pour votre plat "${menuItem.name[currentLang] || menuItem.name.fr}".`,
      en: `Please select the pasta type for your "${menuItem.name[currentLang] || menuItem.name.fr}" dish.`,
      de: `Bitte w\xE4hlen Sie die Nudelsorte f\xFCr Ihr Gericht "${menuItem.name[currentLang] || menuItem.name.fr}".`,
      ar: `\u064A\u0631\u062C\u0649 \u0627\u062E\u062A\u064A\u0627\u0631 \u0646\u0648\u0639 \u0627\u0644\u0645\u0639\u0643\u0631\u0648\u0646\u0629 \u0644\u0637\u0628\u0642 "${menuItem.name[currentLang] || menuItem.name.fr}".`
    };
    if (titleEl) titleEl.textContent = titles[currentLang] || titles.fr;
    if (subtitleEl) subtitleEl.textContent = subtitles[currentLang] || subtitles.fr;
    const closeBtn = document.getElementById("pastaCloseBtn");
    if (closeBtn) {
      closeBtn.onclick = () => {
        modal.style.display = "none";
      };
    }
    renderOptionList("pastaList", "pastaCounter", "pastaConfirmBtn", PASTA_OPTIONS, limit, modal);
  }
  function checkItemOptionsAndAdd(menuItem) {
    if (!menuItem) return;
    const nameFr = menuItem.name && menuItem.name.fr ? menuItem.name.fr : String(menuItem.name || "");
    const upperName = nameFr.toUpperCase().trim();
    const catId = menuItem.categoryId || "";
    if (upperName === "ACCOMPAGNEMENTS" && (menuItem.price === "Inclus" || isNaN(parseFloat(menuItem.price)))) {
      return;
    }
    if (catId === "petit-dejeuner" && upperName !== "MENU ENFANT") {
      openHotDrinkSelectorModal(menuItem);
      return;
    }
    if (catId === "pasta" && !upperName.includes("LASAGNE") && !upperName.includes("SPAGHETTIS NOIRS")) {
      openPastaSelectorModal(menuItem);
      return;
    }
    if (catId === "plats" && upperName !== "MENU ENFANT") {
      openSidesSelectorModal(menuItem);
      return;
    }
    addToCart(menuItem);
  }
  function setPendingActionAfterTableSelect(action) {
    pendingActionAfterTableSelect = action;
  }
  function parseTableFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const table = params.get("table") || params.get("t");
    if (table) {
      clientTable = table;
      try {
        localStorage.setItem("grey_corner_table", table);
      } catch (e) {
      }
    } else {
      try {
        clientTable = localStorage.getItem("grey_corner_table") || null;
      } catch (e) {
        clientTable = null;
      }
    }
    updateTableUI();
    return clientTable;
  }
  function updateTableUI() {
    const badge = document.getElementById("cdTableBadge");
    if (badge) {
      badge.textContent = clientTable ? `Table ${clientTable}` : "S\xE9lectionner Table";
      badge.style.cursor = "pointer";
    }
    const ndTableBadge = document.getElementById("ndTableBadge");
    if (ndTableBadge) {
      ndTableBadge.textContent = clientTable ? getTableZoneName(clientTable) : "Table non d\xE9finie";
    }
    const bellBtn = document.getElementById("notificationBellBtn");
    if (bellBtn) {
      bellBtn.style.display = "none";
    }
  }
  function setTable(num) {
    clientTable = String(num);
    try {
      localStorage.setItem("grey_corner_table", clientTable);
    } catch (e) {
    }
    updateTableUI();
    try {
      const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?table=${num}`;
      window.history.pushState({ path: newUrl }, "", newUrl);
    } catch (e) {
    }
    closeTableModal();
    if (typeof window.subscribeToActiveWaiterEvents === "function") {
      window._currentSubscribedTable = null;
      window.subscribeToActiveWaiterEvents(clientTable);
    }
    if (typeof pendingActionAfterTableSelect === "function") {
      const action = pendingActionAfterTableSelect;
      pendingActionAfterTableSelect = null;
      setTimeout(() => action(clientTable), 150);
    }
  }
  function showTableSelectorModal() {
    const modal = document.getElementById("tableModalOverlay");
    const grid = document.getElementById("tableGridSelect");
    if (!modal || !grid) return;
    modal.style.display = "flex";
    grid.innerHTML = "";
    if (!modal._hasBackdropListener) {
      modal._hasBackdropListener = true;
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeTableModal();
      });
    }
    const closeBtn = document.getElementById("tableModalCloseBtn");
    if (closeBtn && !closeBtn._hasListener) {
      closeBtn._hasListener = true;
      closeBtn.addEventListener("click", closeTableModal);
    }
    const zones = [
      { name: "Salle", start: 101, end: 115 },
      { name: "Loge", start: 201, end: 219 },
      { name: "Terrasse", start: 301, end: 323 }
    ];
    zones.forEach((zone) => {
      const wrapper = document.createElement("div");
      wrapper.style.display = "flex";
      wrapper.style.flexDirection = "column";
      wrapper.style.gap = "8px";
      wrapper.style.width = "100%";
      const title = document.createElement("div");
      title.style.fontFamily = "'DM Sans', sans-serif";
      title.style.fontSize = "0.78rem";
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
      btnGrid.style.gap = "8px";
      for (let i = zone.start; i <= zone.end; i++) {
        const btn = document.createElement("button");
        btn.className = "tgs-btn";
        btn.textContent = i;
        if (String(clientTable) === String(i)) {
          btn.classList.add("active");
          btn.style.background = "var(--sc-gold-light)";
          btn.style.color = "#000";
          btn.style.fontWeight = "bold";
        }
        btn.onclick = () => setTable(i);
        btnGrid.appendChild(btn);
      }
      wrapper.appendChild(title);
      wrapper.appendChild(btnGrid);
      grid.appendChild(wrapper);
    });
  }
  function openCartDrawer() {
    const overlay = document.getElementById("cartDrawerOverlay");
    const drawer = document.getElementById("cartDrawer");
    if (typeof updateCartUI === "function") {
      updateCartUI();
    }
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
  function openTableModal() {
    showTableSelectorModal();
  }
  function closeTableModal() {
    const overlay = document.getElementById("tableModalOverlay");
    if (overlay) {
      overlay.style.display = "none";
    }
  }
  function openBurgerMenu() {
    const burger = document.getElementById("burger");
    const burgerNav = document.getElementById("burgerNav");
    const burgerOverlay = document.getElementById("burgerOverlay");
    if (!burger || !burgerNav || !burgerOverlay) return;
    burger.classList.add("active");
    burger.setAttribute("aria-expanded", "true");
    burgerNav.classList.add("active");
    burgerOverlay.classList.add("active");
    document.body.classList.add("no-scroll");
    document.documentElement.classList.add("no-scroll");
  }
  function closeBurgerMenu() {
    const burger = document.getElementById("burger");
    const burgerNav = document.getElementById("burgerNav");
    const burgerOverlay = document.getElementById("burgerOverlay");
    if (!burger || !burgerNav || !burgerOverlay) return;
    burger.classList.remove("active");
    burger.setAttribute("aria-expanded", "false");
    burgerNav.classList.remove("active");
    burgerOverlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
    document.documentElement.classList.remove("no-scroll");
  }
  function setupBurgerMenu() {
    const burger = document.getElementById("burger");
    const burgerNav = document.getElementById("burgerNav");
    const burgerOverlay = document.getElementById("burgerOverlay");
    if (burger && burgerNav && burgerOverlay) {
      burger.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = burgerNav.classList.contains("active");
        isOpen ? closeBurgerMenu() : openBurgerMenu();
      };
      burgerOverlay.onclick = () => closeBurgerMenu();
      burgerNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => closeBurgerMenu());
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && burgerNav.classList.contains("active")) {
          closeBurgerMenu();
        }
      });
    }
  }
  function GC_switchGpsTab(type) {
    const btnAndroid = document.getElementById("gpsTabAndroid");
    const btnIos = document.getElementById("gpsTabIos");
    const guideAndroid = document.getElementById("gpsGuideAndroid");
    const guideIos = document.getElementById("gpsGuideIos");
    if (!btnAndroid || !btnIos || !guideAndroid || !guideIos) return;
    const ACTIVE_BG = "rgba(201,168,76,0.18)";
    const ACTIVE_COLOR = "#C9A84C";
    const INACTIVE_BG = "transparent";
    const INACTIVE_COLOR = "rgba(240,234,216,0.5)";
    if (type === "ios") {
      btnIos.style.background = ACTIVE_BG;
      btnIos.style.color = ACTIVE_COLOR;
      btnIos.style.fontWeight = "700";
      btnAndroid.style.background = INACTIVE_BG;
      btnAndroid.style.color = INACTIVE_COLOR;
      btnAndroid.style.fontWeight = "600";
      guideIos.style.display = "flex";
      guideAndroid.style.display = "none";
    } else {
      btnAndroid.style.background = ACTIVE_BG;
      btnAndroid.style.color = ACTIVE_COLOR;
      btnAndroid.style.fontWeight = "700";
      btnIos.style.background = INACTIVE_BG;
      btnIos.style.color = INACTIVE_COLOR;
      btnIos.style.fontWeight = "600";
      guideAndroid.style.display = "flex";
      guideIos.style.display = "none";
    }
  }
  function GC_showGpsBlocked() {
    const overlay = document.getElementById("gpsBlockedOverlay");
    const sheet = document.getElementById("gpsBlockedSheet");
    if (!overlay) return;
    const ua = navigator.userAgent || "";
    const isIOS = /iPhone|iPad|iPod/i.test(ua) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
    GC_switchGpsTab(isIOS ? "ios" : "android");
    overlay.style.display = "flex";
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (sheet) sheet.style.transform = "translateY(0)";
    }));
  }
  function GC_hideGpsBlocked() {
    const overlay = document.getElementById("gpsBlockedOverlay");
    const sheet = document.getElementById("gpsBlockedSheet");
    if (!overlay) return;
    if (sheet) sheet.style.transform = "translateY(100%)";
    setTimeout(() => {
      overlay.style.display = "none";
    }, 380);
  }
  function GC_dismissGpsBlocked() {
    GC_hideGpsBlocked();
    const bar = document.getElementById("clientActionBar");
    if (bar) bar.style.display = "none";
  }
  function GC_showPreorderModal() {
    const overlay = document.getElementById("preorderModeOverlay");
    const sheet = document.getElementById("preorderModeSheet");
    if (!overlay) return;
    overlay.style.display = "flex";
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (sheet) sheet.style.transform = "translateY(0)";
    }));
  }
  function GC_hidePreorderModal() {
    const overlay = document.getElementById("preorderModeOverlay");
    const sheet = document.getElementById("preorderModeSheet");
    if (!overlay) return;
    if (sheet) sheet.style.transform = "translateY(100%)";
    setTimeout(() => {
      overlay.style.display = "none";
    }, 380);
  }
  function GC_selectMode(mode) {
    window.GC_preorderMode = mode;
    const p = document.getElementById("pmPickup");
    const t2 = document.getElementById("pmTable");
    const w = document.getElementById("pmTableNumWrap");
    const c = document.getElementById("pmConfirm");
    const GOLD = "rgba(201,168,76,0.18)", DIM = "rgba(201,168,76,0.07)";
    if (p) {
      p.style.background = mode === "pickup" ? GOLD : DIM;
      p.style.borderColor = mode === "pickup" ? "#C9A84C" : "rgba(201,168,76,0.2)";
    }
    if (t2) {
      t2.style.background = mode === "table" ? GOLD : DIM;
      t2.style.borderColor = mode === "table" ? "#C9A84C" : "rgba(201,168,76,0.2)";
    }
    if (w) w.style.display = mode === "table" ? "block" : "none";
    if (c) {
      c.disabled = false;
      c.style.background = "rgba(201,168,76,0.18)";
      c.style.borderColor = "#C9A84C";
      c.style.color = "#f0ead8";
      c.style.cursor = "pointer";
    }
  }
  function GC_confirmMode() {
    if (!window.GC_preorderMode) return;
    const inp = document.getElementById("pmTableNumInput");
    window.GC_preorderTable = inp && inp.value.trim() ? inp.value.trim() : null;
    window.GC_isPreorder = true;
    GC_hidePreorderModal();
    GC_applyPreorderUI();
  }
  function GC_dismissModal() {
    GC_hidePreorderModal();
    GC_applyReadonlyUI();
  }
  function GC_requestGpsAgain() {
    if (!navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        GC_hideGpsBlocked();
        if (typeof window.GPSService !== "undefined" && typeof window.GPSService.checkLocation === "function") {
          window.GPSService.checkLocation();
        } else {
          location.reload();
        }
      },
      (err) => {
        if (err.code === 1) {
          const hint = document.getElementById("gpsBlockedHint");
          if (hint) {
            hint.style.display = "block";
            hint.style.color = "#e87c3e";
          }
        } else {
          location.reload();
        }
      },
      { timeout: 8e3, enableHighAccuracy: true }
    );
  }
  function GC_patchSubmitButton() {
    const btn = document.getElementById("cdSubmitBtn");
    if (!btn) return false;
    btn.innerHTML = `<span style="display:flex;align-items:center;justify-content:center;gap:8px;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0;">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.522 5.85L0 24l6.335-1.502A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.814 9.814 0 01-5.007-1.373l-.36-.214-3.727.883.936-3.619-.234-.373A9.818 9.818 0 012.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z"/>
      </svg>
      Commander via WhatsApp
  </span>`;
    btn.style.background = "linear-gradient(135deg,#25D366,#128C7E)";
    btn.style.borderColor = "#25D366";
    btn.style.color = "#fff";
    btn.style.opacity = "1";
    btn.style.pointerEvents = "auto";
    btn.disabled = false;
    btn.removeAttribute("disabled");
    btn.classList.remove("disabled-gps", "frozen-disabled");
    document.querySelectorAll(".cd-warning-text").forEach((el) => el.style.display = "none");
    return true;
  }
  function GC_applyPreorderUI() {
    const badge = document.getElementById("gpsStatusBadge");
    const text = document.getElementById("gpsStatusText");
    if (badge) {
      badge.className = "gps-status-badge";
      badge.style.background = "rgba(201,168,76,0.15)";
      badge.style.borderColor = "rgba(201,168,76,0.4)";
    }
    if (text) text.textContent = "\u{1F7E1} Pr\xE9commande";
    const cdBadge = document.getElementById("cdTableBadge");
    if (cdBadge) {
      cdBadge.textContent = window.GC_preorderMode === "pickup" ? "\xC0 emporter" : window.GC_preorderTable ? "Table " + window.GC_preorderTable : "\xC0 table";
    }
    ["cabCallWaiter", "cabRequestWater", "cabRequestBill"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });
    const bar = document.getElementById("clientActionBar");
    if (bar) bar.style.display = "block";
    GC_patchSubmitButton();
  }
  function GC_applyReadonlyUI() {
    const bar = document.getElementById("clientActionBar");
    if (bar) bar.style.display = "none";
  }
  window.GC_preorderMode = window.GC_preorderMode || null;
  window.GC_preorderTable = window.GC_preorderTable || null;
  window.GC_isPreorder = window.GC_isPreorder || false;
  window.openCartDrawer = openCartDrawer;
  window.closeCartDrawer = closeCartDrawer;
  window.openTableModal = openTableModal;
  window.closeTableModal = closeTableModal;
  window.showTableSelectorModal = showTableSelectorModal;
  window.setTable = setTable;
  window.openBurgerMenu = openBurgerMenu;
  window.closeBurgerMenu = closeBurgerMenu;
  window.setupBurgerMenu = setupBurgerMenu;
  window.GC_switchGpsTab = GC_switchGpsTab;
  window.GC_showGpsBlocked = GC_showGpsBlocked;
  window.GC_hideGpsBlocked = GC_hideGpsBlocked;
  window.GC_dismissGpsBlocked = GC_dismissGpsBlocked;
  window.GC_showPreorderModal = GC_showPreorderModal;
  window.GC_hidePreorderModal = GC_hidePreorderModal;
  window.GC_selectMode = GC_selectMode;
  window.GC_confirmMode = GC_confirmMode;
  window.GC_dismissModal = GC_dismissModal;
  window.GC_requestGpsAgain = GC_requestGpsAgain;
  window.GC_patchSubmitButton = GC_patchSubmitButton;
  window.GC_applyPreorderUI = GC_applyPreorderUI;
  window.GC_applyReadonlyUI = GC_applyReadonlyUI;

  // js/services/notifications.js
  var memoryNotifications = [];
  var cooldowns = {};
  var unsubscribersList = [];
  var notifiedCallIds = /* @__PURE__ */ new Set();
  var notifiedOrderIds = /* @__PURE__ */ new Set();
  function checkCallCooldown(type) {
    const lastTime = cooldowns[type] || 0;
    const elapsed = (Date.now() - lastTime) / 1e3;
    if (elapsed < 60) {
      return Math.ceil(60 - elapsed);
    }
    return 0;
  }
  function setCallCooldown(type) {
    cooldowns[type] = Date.now();
  }
  function triggerQuickServiceCall(clientTable2, type) {
    if (!clientTable2) {
      const tableMsgs = {
        fr: "Veuillez choisir votre num\xE9ro de table.",
        en: "Please select your table number.",
        de: "Bitte w\xE4hlen Sie Ihre Tischnummer.",
        ar: "\u064A\u0631\u062C\u0649 \u0627\u062E\u062A\u064A\u0627\u0631 \u0631\u0642\u0645 \u0637\u0627\u0648\u0644\u062A\u0643."
      };
      showToast(tableMsgs[currentLang] || tableMsgs.fr);
      setPendingActionAfterTableSelect((selectedTable) => triggerQuickServiceCall(selectedTable, type));
      showTableSelectorModal();
      return;
    }
    const waitRemaining = checkCallCooldown(type);
    if (waitRemaining > 0) {
      const errorMsgs = {
        fr: `Veuillez attendre ${waitRemaining}s avant de renouveler cet appel.`,
        en: `Please wait ${waitRemaining}s before repeating this request.`,
        de: `Bitte warten Sie ${waitRemaining}s, bevor Sie diese Anfrage wiederholen.`,
        ar: `\u064A\u0631\u062C\u0649 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631 ${waitRemaining} \u062B\u0627\u0646\u064A\u0629 \u0642\u0628\u0644 \u062A\u0643\u0631\u0627\u0631 \u0647\u0630\u0627 \u0627\u0644\u0637\u0644\u0628.`
      };
      showToast(errorMsgs[currentLang] || errorMsgs.fr);
      return;
    }
    const btnId = type === "waiter" ? "cabCallWaiter" : type === "water" ? "cabRequestWater" : "cabRequestBill";
    const btn = document.getElementById(btnId);
    if (btn) btn.classList.add("active");
    dbService.sendCall(clientTable2, type, (success, callId) => {
      if (btn) btn.classList.remove("active");
      if (success) {
        setCallCooldown(type);
        const okMsgs = {
          fr: "Appel envoy\xE9 ! Votre serveur a \xE9t\xE9 alert\xE9.",
          en: "Call sent! Your waiter has been alerted.",
          de: "Anruf gesendet! Ihr Kellner wurde benachrichtigt.",
          ar: "\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0637\u0644\u0628 ! \u062A\u0645 \u0625\u0634\u0639\u0627\u0631 \u0646\u0627\u062F\u0644\u0643."
        };
        showToast(okMsgs[currentLang] || okMsgs.fr);
        if (callId) {
          localStorage.setItem(`last_call_${type}`, String(callId));
        }
        subscribeToActiveWaiterEvents(clientTable2);
      } else {
        showToast("Erreur de connexion. Veuillez r\xE9essayer.");
      }
    });
  }
  function triggerHapticVibrate() {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate([200, 100, 200, 100, 300]);
      } catch (e) {
      }
    }
  }
  var chimeAudio = null;
  var audioCtx = null;
  function getChimeAudio() {
    if (!chimeAudio) {
      chimeAudio = new Audio("https://assets.mixkit.co/active_storage/sfx/911/911-200.wav");
      chimeAudio.volume = 0.55;
    }
    return chimeAudio;
  }
  function getAudioContext() {
    if (!audioCtx && typeof window !== "undefined") {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {
      });
    }
    return audioCtx;
  }
  if (typeof window !== "undefined") {
    const unlockAudio = () => {
      try {
        const ctx = getAudioContext();
        if (ctx) {
          const buffer = ctx.createBuffer(1, 1, 22050);
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(ctx.destination);
          source.start(0);
        }
      } catch (e) {
      }
      try {
        const audio = getChimeAudio();
        audio.play().then(() => {
          audio.pause();
          audio.currentTime = 0;
        }).catch(() => {
        });
      } catch (e) {
      }
      document.removeEventListener("touchstart", unlockAudio);
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("pointerdown", unlockAudio);
    };
    document.addEventListener("touchstart", unlockAudio, { once: true });
    document.addEventListener("click", unlockAudio, { once: true });
    document.addEventListener("pointerdown", unlockAudio, { once: true });
  }
  function playChimeSound() {
    let playedWebAudio = false;
    try {
      const ctx = getAudioContext();
      if (ctx) {
        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(659.25, now);
        gain1.gain.setValueAtTime(0.4, now);
        gain1.gain.exponentialRampToValueAtTime(1e-4, now + 0.8);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.8);
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(987.77, now + 0.14);
        gain2.gain.setValueAtTime(0.5, now + 0.14);
        gain2.gain.exponentialRampToValueAtTime(1e-4, now + 1.2);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.14);
        osc2.stop(now + 1.2);
        playedWebAudio = true;
      }
    } catch (e) {
      console.warn("\u26A0\uFE0F Web Audio chime error:", e);
    }
    if (!playedWebAudio) {
      try {
        const chime = getChimeAudio();
        chime.currentTime = 0;
        const promise = chime.play();
        if (promise !== void 0) {
          promise.catch((e) => console.log("\u{1F50A} Audio autoplay status:", e));
        }
      } catch (e) {
      }
    }
  }
  function addNotificationToHistory(message, tableId) {
    const timeStr = (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    memoryNotifications.push({
      id: Math.random().toString(36).substr(2, 9),
      time: timeStr,
      title: "Service Grey Corner",
      message,
      table: tableId
    });
    if (memoryNotifications.length > 25) {
      memoryNotifications.shift();
    }
    const callBadge = document.getElementById("cabCallBadge");
    if (callBadge) {
      callBadge.style.display = "block";
    }
  }
  function subscribeToActiveWaiterEvents(clientTable2) {
    if (!clientTable2) return;
    if (window._currentSubscribedTable === String(clientTable2) && unsubscribersList.length > 0) {
      return;
    }
    window._currentSubscribedTable = String(clientTable2);
    unsubscribersList.forEach((unsub) => {
      try {
        unsub();
      } catch (e) {
      }
    });
    unsubscribersList = [];
    const unsubCalls = dbService.onCallsChange((calls) => {
      if (!Array.isArray(calls)) return;
      calls.forEach((c) => {
        if (String(c.table) !== String(clientTable2)) return;
        if (c.status !== "accepted") return;
        if (notifiedCallIds.has(String(c.id))) return;
        const lastCallId = localStorage.getItem(`last_call_${c.type}`);
        const isMyCall = lastCallId && String(lastCallId) === String(c.id);
        let isRecent = false;
        if (c.acceptedAt) {
          const acceptedTime = new Date(c.acceptedAt).getTime();
          if (!isNaN(acceptedTime) && Date.now() - acceptedTime < 3e5) {
            isRecent = true;
          }
        } else {
          isRecent = true;
        }
        if (isMyCall || isRecent) {
          notifiedCallIds.add(String(c.id));
          if (isMyCall) {
            localStorage.removeItem(`last_call_${c.type}`);
          }
          const typeNames = {
            waiter: "Appel serveur",
            water: "Demande d'eau",
            bill: "Demande d'addition"
          };
          const typeLabel = typeNames[c.type] || "Demande";
          const acceptedMsgs = {
            fr: `\u{1F514} Le serveur a accept\xE9 votre ${typeLabel} et arrive \xE0 votre table !`,
            en: `\u{1F514} The waiter accepted your ${typeLabel} and is coming to your table!`,
            de: `\u{1F514} Ihr Kellner hat Ihre ${typeLabel} angenommen und kommt zu Ihrem Tisch!`,
            ar: `\u{1F514} \u0644\u0642\u062F \u0642\u0628\u0644 \u0627\u0644\u0646\u0627\u062F\u0644 \u0637\u0644\u0628\u0643 \u0648\u0647\u0648 \u0641\u064A \u0627\u0644\u0637\u0631\u064A\u0642 \u0625\u0644\u0649 \u0637\u0627\u0648\u0644\u062A\u0643 !`
          };
          const msg = acceptedMsgs[currentLang] || acceptedMsgs.fr;
          showToast(msg);
          playChimeSound();
          triggerHapticVibrate();
          addNotificationToHistory(msg, clientTable2);
        }
      });
    });
    if (typeof unsubCalls === "function") unsubscribersList.push(unsubCalls);
    const unsubOrders = dbService.onPreOrdersChange((orders) => {
      if (!Array.isArray(orders)) return;
      orders.forEach((o) => {
        if (String(o.table) !== String(clientTable2)) return;
        if (o.status !== "accepted") return;
        if (notifiedOrderIds.has(String(o.id))) return;
        const lastOrderId = localStorage.getItem("last_pre_order_id");
        const isMyOrder = lastOrderId && String(lastOrderId) === String(o.id);
        let isRecent = false;
        if (o.acceptedAt) {
          const acceptedTime = new Date(o.acceptedAt).getTime();
          if (!isNaN(acceptedTime) && Date.now() - acceptedTime < 3e5) {
            isRecent = true;
          }
        } else {
          isRecent = true;
        }
        if (isMyOrder || isRecent) {
          notifiedOrderIds.add(String(o.id));
          if (isMyOrder) {
            localStorage.removeItem("last_pre_order_id");
          }
          const acceptedMsgs = {
            fr: "\u{1F468}\u200D\u{1F373} Le serveur a valid\xE9 votre pr\xE9commande !",
            en: "\u{1F468}\u200D\u{1F373} The waiter confirmed your pre-order!",
            de: "\u{1F468}\u200D\u{1F373} Der Kellner hat Ihre Vorbestellung best\xE4tigt!",
            ar: "\u{1F468}\u200D\u{1F373} \u0644\u0642\u062F \u0648\u0627\u0641\u0642 \u0627\u0644\u0646\u0627\u062F\u0644 \u0639\u0644\u0649 \u0637\u0644\u0628\u0643 \u0627\u0644\u0645\u0633\u0628\u0642 !"
          };
          const msg = acceptedMsgs[currentLang] || acceptedMsgs.fr;
          showToast(msg);
          playChimeSound();
          triggerHapticVibrate();
          addNotificationToHistory(msg, clientTable2);
        }
      });
    });
    if (typeof unsubOrders === "function") unsubscribersList.push(unsubOrders);
  }
  function renderNotificationHistory(clientTable2) {
    const ndContentFeed = document.getElementById("ndContentFeed");
    if (!ndContentFeed) return;
    ndContentFeed.innerHTML = "";
    const tableNotifications = memoryNotifications.filter((n) => String(n.table) === String(clientTable2));
    if (tableNotifications.length === 0) {
      ndContentFeed.innerHTML = `
      <div style="text-align: center; color: rgba(240, 234, 216, 0.4); padding: 40px 20px; font-size: 0.85rem;">
        Aucune notification r\xE9cente
      </div>
    `;
      return;
    }
    tableNotifications.slice().reverse().forEach((notif) => {
      const card = document.createElement("div");
      card.className = "nd-card";
      card.innerHTML = `
      <div class="nd-card-header">
        <span class="nd-card-title">${notif.title}</span>
        <span class="nd-card-time">${notif.time}</span>
      </div>
      <div class="nd-card-body">${notif.message}</div>
    `;
      ndContentFeed.appendChild(card);
    });
  }
  function setupNotificationDrawer(getClientTable) {
    const bellBtn = document.getElementById("notificationBellBtn");
    const ndOverlay = document.getElementById("notificationDrawerOverlay");
    const ndCloseBtn = document.getElementById("ndCloseBtn");
    const bellBadge = document.getElementById("bellBadge");
    if (bellBtn) {
      bellBtn.onclick = () => {
        if (bellBadge) bellBadge.style.display = "none";
        if (ndOverlay) ndOverlay.classList.add("active");
        const currentTable = typeof getClientTable === "function" ? getClientTable() : getClientTable;
        renderNotificationHistory(currentTable);
      };
    }
    if (ndCloseBtn) {
      ndCloseBtn.onclick = () => {
        if (ndOverlay) ndOverlay.classList.remove("active");
      };
    }
    if (ndOverlay) {
      ndOverlay.onclick = (e) => {
        if (e.target === ndOverlay) {
          ndOverlay.classList.remove("active");
        }
      };
    }
  }
  window.triggerQuickServiceCall = triggerQuickServiceCall;
  window.renderNotificationHistory = renderNotificationHistory;
  window.subscribeToActiveWaiterEvents = subscribeToActiveWaiterEvents;
  window.playChimeSound = playChimeSound;
  window.triggerHapticVibrate = triggerHapticVibrate;

  // js/services/orders.js
  var WHATSAPP_NUMBER = "212666265160";
  function GC_sendWhatsApp() {
    if (!clientCart || clientCart.length === 0) {
      const emptyMsgs = {
        fr: "Votre panier est vide.",
        en: "Your cart is empty.",
        de: "Ihr Warenkorb ist leer.",
        ar: "\u0633\u0644\u062A\u0643\u0645 \u0641\u0627\u0631\u063A\u0629."
      };
      alert(emptyMsgs[currentLang] || emptyMsgs.fr);
      return;
    }
    const lang = currentLang || localStorage.getItem("lang") || "fr";
    const modeLabel = window.GC_preorderMode === "pickup" ? "\xC0 emporter (comptoir)" : "\xC0 table" + (window.GC_preorderTable ? " n\xB0" + window.GC_preorderTable : " \u2014 num\xE9ro \xE0 pr\xE9ciser \xE0 l'arriv\xE9e");
    let lines = "", total = 0;
    clientCart.forEach((item) => {
      const qty = item.qty || 1;
      const price = item.price || 0;
      const sub = price * qty;
      total += sub;
      const name = item.name && typeof item.name === "object" ? item.name[lang] || item.name.fr || Object.values(item.name)[0] : item.name || "Article";
      const drinkInfo = item.drinkChoices && item.drinkChoices.length > 0 ? " (" + item.drinkChoices.join(", ") + ")" : "";
      lines += `\u2022 ${name}${drinkInfo}${qty > 1 ? " x" + qty : ""} \u2014 ${sub} MAD
`;
    });
    const noteEl = document.getElementById("cdSpecialNote");
    const noteText = noteEl && noteEl.value.trim() ? "\n\u{1F4DD} Note : " + noteEl.value.trim() : "";
    const msg = `\u{1F6D2} *Pr\xE9commande Grey Corner*
Mode : ${modeLabel}
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
${lines}\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
\u{1F4B0} Total : ${total} MAD${noteText}`;
    window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg), "_blank");
    setTimeout(() => {
      clearCart();
      if (noteEl) noteEl.value = "";
      const ov = document.getElementById("cartDrawerOverlay");
      const dr = document.getElementById("cartDrawer");
      if (ov) ov.classList.remove("active");
      if (dr) dr.classList.remove("active");
      document.body.style.overflow = "";
    }, 600);
  }
  function submitOrderOrWhatsApp(clientTable2, onComplete) {
    if (window.GC_isPreorder) {
      GC_sendWhatsApp();
      if (onComplete) onComplete();
      return;
    }
    submitPreOrder(clientTable2, onComplete);
  }
  function submitPreOrder(clientTable2, onComplete) {
    if (!clientCart || clientCart.length === 0) return;
    const btn = document.getElementById("cdSubmitBtn");
    const spinner = document.getElementById("cdSubmitSpinner");
    const resetBtn = () => {
      if (btn) btn.disabled = false;
      if (spinner) spinner.style.display = "none";
      if (onComplete) onComplete();
    };
    if (window.systemFrozen) {
      const frozenMsgs = {
        fr: "Le service est temporairement suspendu (mode rush). Merci de patienter un instant.",
        en: "Service is temporarily paused (rush mode). Please wait a moment.",
        de: "Der Service ist vor\xFCbergehend pausiert (Sto\xDFzeit). Bitte warten Sie einen Moment.",
        ar: "\u0627\u0644\u062E\u062F\u0645\u0629 \u0645\u0639\u0644\u0642\u0629 \u0645\u0624\u0642\u062A\u0627\u064B (\u0641\u062A\u0631\u0629 \u0627\u0644\u0630\u0631\u0648\u0629). \u064A\u0631\u062C\u0649 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631 \u0644\u062D\u0638\u0627\u062A."
      };
      showToast(frozenMsgs[currentLang] || frozenMsgs.fr);
      return;
    }
    if (!clientTable2) {
      resetBtn();
      const tableMsgs = {
        fr: "Veuillez choisir votre num\xE9ro de table avant d'envoyer la commande.",
        en: "Please select your table number before sending the order.",
        de: "Bitte w\xE4hlen Sie Ihre Tischnummer, bevor Sie die Bestellung senden.",
        ar: "\u064A\u0631\u062C\u0649 \u0627\u062E\u062A\u064A\u0627\u0631 \u0631\u0642\u0645 \u0637\u0627\u0648\u0644\u062A\u0643 \u0642\u0628\u0644 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0637\u0644\u0628."
      };
      showToast(tableMsgs[currentLang] || tableMsgs.fr);
      setPendingActionAfterTableSelect((selectedTable) => submitPreOrder(selectedTable, onComplete));
      showTableSelectorModal();
      return;
    }
    if (btn) {
      if (btn.disabled) return;
      btn.disabled = true;
    }
    if (spinner) spinner.style.display = "block";
    const note = document.getElementById("cdSpecialNote") ? document.getElementById("cdSpecialNote").value : "";
    const totalPrice = clientCart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const itemsList = clientCart.map((c) => {
      let nameFr = c.name.fr || c.name;
      if (c.drinkChoices && c.drinkChoices.length > 0) {
        nameFr += ` (${c.drinkChoices.join(", ")})`;
      }
      return {
        name: nameFr,
        name_lang: nameFr,
        category: c.categoryNameFr || "",
        price: c.price.toString(),
        qty: c.qty,
        note: c.note || ""
      };
    });
    dbService.sendPreOrder(clientTable2, itemsList, note, totalPrice, (success, orderId) => {
      resetBtn();
      if (success) {
        try {
          const chime = new Audio("https://assets.mixkit.co/active_storage/sfx/911/911-200.wav");
          chime.volume = 0.4;
          chime.play();
        } catch (e) {
        }
        const okMsgs = {
          fr: "Pr\xE9commande envoy\xE9e ! Le serveur arrive la confirmer.",
          en: "Pre-order sent! The waiter is coming to confirm.",
          de: "Vorbestellung gesendet! Der Kellner kommt zur Best\xE4tigung.",
          ar: "\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0637\u0644\u0628 \u0627\u0644\u0645\u0633\u0628\u0642 ! \u0627\u0644\u0646\u0627\u062F\u0644 \u0642\u0627\u062F\u0645 \u0644\u062A\u0623\u0643\u064A\u062F\u0647."
        };
        showToast(okMsgs[currentLang] || okMsgs.fr);
        clearCart();
        if (document.getElementById("cdSpecialNote")) {
          document.getElementById("cdSpecialNote").value = "";
        }
        const cdOverlay = document.getElementById("cartDrawerOverlay");
        const cdDrawer = document.getElementById("cartDrawer");
        if (cdOverlay) cdOverlay.classList.remove("active");
        if (cdDrawer) cdDrawer.classList.remove("active");
        document.body.classList.remove("no-scroll");
        localStorage.setItem("last_pre_order_id", orderId);
        subscribeToActiveWaiterEvents(clientTable2);
      } else {
        showToast("Erreur de connexion. Veuillez r\xE9essayer.");
      }
    });
  }
  window.submitPreOrder = submitPreOrder;
  window.submitOrderOrWhatsApp = submitOrderOrWhatsApp;
  window.GC_sendWhatsApp = GC_sendWhatsApp;

  // js/ui/menu-render.js
  var activeCategoryId = null;
  var isViewAllMode = false;
  var imagesProtected = false;
  var activeLightboxItem = null;
  function getCategorySvgIcon(categoryId) {
    const icons = {
      "petit-dejeuner": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`,
      "entrees": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>`,
      "entrees-chaudes": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>`,
      "plats": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18h18v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1z"></path><path d="M4 18a8 8 0 0 1 16 0"></path><line x1="12" y1="6" x2="12" y2="3"></line></svg>`,
      "couscous-vendredi": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3 5H9l3-5z"></path><path d="M5 14a7 7 0 0 0 14 0H5z"></path><path d="M3 18h18v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2z"></path></svg>`,
      "sandwichs": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="6" rx="3"></rect><path d="M5 11a7 7 0 0 1 14 0"></path><line x1="3" y1="14" x2="21" y2="14"></line></svg>`,
      "burgers": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a8 8 0 0 1 16 0H4z"></path><rect x="3" y="15" width="18" height="4" rx="2"></rect><line x1="5" y1="13" x2="19" y2="13"></line></svg>`,
      "panini": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="12" rx="9" ry="5"></ellipse><line x1="8" y1="10" x2="10" y2="14"></line><line x1="12" y1="10" x2="14" y2="14"></line></svg>`,
      "pizza": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l9 16a2 2 0 0 1-1.7 3H4.7A2 2 0 0 1 3 18L12 2z"></path><circle cx="12" cy="12" r="1.5" fill="currentColor"></circle><circle cx="9" cy="16" r="1" fill="currentColor"></circle><circle cx="15" cy="15" r="1" fill="currentColor"></circle></svg>`,
      "pasta": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v10"></path><path d="M9 8c1.5 2 4.5 2 6 0"></path><path d="M9 16c1.5-2 4.5-2 6 0"></path></svg>`,
      "crepes": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="8" rx="8" ry="4"></ellipse><path d="M4 8v4c0 2.2 3.6 4 8 4s8-1.8 8-4V8"></path><path d="M4 12v4c0 2.2 3.6 4 8 4s8-1.8 8-4v-4"></path></svg>`,
      "crepes-salees": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V6s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>`,
      "gateaux": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"></path><path d="M4 16s2-1 4-1 4 1 4 1 2-1 4-1 4 1 4 1"></path><path d="M2 21h20"></path><circle cx="12" cy="5" r="2"></circle></svg>`,
      "boissons-chaudes": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><path d="M6 2v3"></path><path d="M10 2v3"></path><path d="M14 2v3"></path></svg>`,
      "soda": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="12" height="16" rx="3"></rect><line x1="6" y1="8" x2="18" y2="8"></line><line x1="10" y1="2" x2="14" y2="2"></line></svg>`,
      "eau-minerale": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>`,
      "boissons": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"></path><path d="M12 15v6"></path><path d="M17 3l3 8H4l3-8h10z"></path></svg>`,
      "ice-tea": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l-1.5 16a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2L6 3z"></path><line x1="6" y1="8" x2="18" y2="8"></line><line x1="14" y1="2" x2="16" y2="12"></line></svg>`,
      "ice-coffee": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h12l-1.5 16a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2L6 4z"></path><rect x="9" y="10" width="3" height="3" rx="0.5"></rect><rect x="12" y="13" width="3" height="3" rx="0.5"></rect></svg>`,
      "frappuccino": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 8h10l-1.2 13a2 2 0 0 1-2 1.8H10.2a2 2 0 0 1-2-1.8L7 8z"></path><path d="M7 8a5 5 0 0 1 10 0"></path><line x1="12" y1="2" x2="15" y2="12"></line></svg>`,
      "cocktails": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"></path><path d="M12 15v7"></path><path d="M5 3l7 8 7-8H5z"></path></svg>`,
      "mojito": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="12" height="16" rx="2"></rect><circle cx="12" cy="11" r="3"></circle><line x1="12" y1="2" x2="12" y2="4"></line></svg>`,
      "smoothies": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 6h10l-1.5 14a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2L7 6z"></path><path d="M12 6c-2-3 2-4 0-6"></path><path d="M16 3l-2 3"></path></svg>`,
      "smoothie-bowl": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12a10 10 0 0 0 20 0H2z"></path><circle cx="8" cy="8" r="1.5"></circle><circle cx="12" cy="6" r="1.5"></circle><circle cx="16" cy="8" r="1.5"></circle></svg>`,
      "milkshakes": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 8h8l-1.2 12a2 2 0 0 1-2 2h-1.6a2 2 0 0 1-2-2L8 8z"></path><path d="M8 8a4 4 0 0 1 8 0"></path><line x1="12" y1="2" x2="14" y2="10"></line></svg>`,
      "glace": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 10a6 6 0 0 1 12 0c0 4-3 6-6 6s-6-2-6-6z"></path><path d="M12 16v5"></path><path d="M8 21h8"></path></svg>`
    };
    return icons[categoryId] || `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"></circle><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>`;
  }
  function getCatId(category) {
    if (category.id) return category.id;
    const fr = category.category && category.category.fr ? category.category.fr : "";
    return fr.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  function getCatImage(category) {
    if (category.items && category.items.length > 0 && category.items[0].image) {
      return category.items[0].image;
    }
    return "images/logo-gold.webp";
  }
  function renderCategoryPastilles() {
    const container = document.getElementById("hubCategories");
    if (!container || !menuData || !Array.isArray(menuData)) return;
    container.innerHTML = "";
    menuData.forEach((category) => {
      const catId = getCatId(category);
      const catName = category.category && (category.category[currentLang] || category.category.fr) || catId;
      const catImg = getCatImage(category);
      const iconSvg = getCategorySvgIcon(catId);
      const isActive = catId === activeCategoryId && !isViewAllMode;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `hub-cat-item ${isActive ? "active" : ""}`;
      btn.dataset.catId = catId;
      btn.setAttribute("aria-label", catName);
      btn.innerHTML = `
      <div class="hub-cat-circle">
        <img src="${catImg}" alt="${catName}" class="hub-cat-img" loading="lazy" />
        <div class="hub-cat-overlay"></div>
        <div class="hub-cat-icon">${iconSvg}</div>
      </div>
      <span class="hub-cat-label">${catName}</span>
    `;
      btn.addEventListener("click", () => {
        selectCategory(catId);
      });
      container.appendChild(btn);
    });
  }
  function selectCategory(catId, smoothScroll = true) {
    activeCategoryId = catId;
    isViewAllMode = false;
    const searchInput = document.getElementById("searchInput");
    const clearBtn = document.getElementById("searchClearBtn");
    if (searchInput && searchInput.value) {
      searchInput.value = "";
      if (clearBtn) clearBtn.style.display = "none";
    }
    const pastilles = document.querySelectorAll(".hub-cat-item");
    pastilles.forEach((p) => {
      const isThis = p.dataset.catId === catId;
      p.classList.toggle("active", isThis);
      if (isThis) {
        p.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    });
    renderDishes();
    if (smoothScroll) {
      const hubNav = document.querySelector(".hub-categories-wrap");
      const offset = hubNav ? hubNav.offsetHeight + 10 : 120;
      const menuGrid = document.getElementById("menu-grid");
      if (menuGrid) {
        const targetY = menuGrid.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: Math.max(0, targetY),
          behavior: "smooth"
        });
      }
    }
    closeBurgerMenu();
  }
  function showAllDishes() {
    isViewAllMode = true;
    document.querySelectorAll(".hub-cat-item").forEach((p) => p.classList.remove("active"));
    renderDishes();
  }
  function renderDishes(filterTerm = "") {
    const menuGrid = document.getElementById("menu-grid");
    if (!menuGrid || !menuData) return;
    const term = (filterTerm || "").toLowerCase().trim();
    if (term) {
      menuGrid.innerHTML = "";
      const resultsWrap = document.createElement("div");
      resultsWrap.className = "hub-results-wrap";
      const titleTexts = {
        fr: `R\xE9sultats pour "${filterTerm}"`,
        en: `Results for "${filterTerm}"`,
        de: `Ergebnisse f\xFCr "${filterTerm}"`,
        ar: `\u0646\u062A\u0627\u0626\u062C \u0627\u0644\u0628\u062D\u062B \u0639\u0646 "${filterTerm}"`
      };
      resultsWrap.innerHTML = `
      <div class="hub-section-header">
        <div class="hub-header-left">
          <h2 class="hub-section-title">${titleTexts[currentLang] || titleTexts.fr}</h2>
        </div>
      </div>
      <div class="hub-dishes-grid"></div>
    `;
      const grid2 = resultsWrap.querySelector(".hub-dishes-grid");
      let matchCount = 0;
      menuData.forEach((cat) => {
        const catId = getCatId(cat);
        const catName = cat.category[currentLang] || cat.category.fr;
        (cat.items || []).forEach((item, idx) => {
          const name = (item.name[currentLang] || item.name.fr || "").toLowerCase();
          const desc = (item.description[currentLang] || item.description.fr || "").toLowerCase();
          if (name.includes(term) || desc.includes(term)) {
            matchCount++;
            item.categoryId = catId;
            item.categoryNameFr = cat.category.fr;
            grid2.appendChild(createDishCard(item, catId, idx, catName));
          }
        });
      });
      if (matchCount === 0) {
        const noResultsTexts = {
          fr: "Aucun plat trouv\xE9 pour cette recherche.",
          en: "No dish found for this search.",
          de: "Kein Gericht f\xFCr diese Suche gefunden.",
          ar: "\u0644\u0645 \u064A\u062A\u0645 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0623\u064A \u0637\u0628\u0642 \u0644\u0647\u0630\u0627 \u0627\u0644\u0628\u062D\u062B."
        };
        grid2.innerHTML = `<div class="hub-no-results">${noResultsTexts[currentLang] || noResultsTexts.fr}</div>`;
      }
      menuGrid.appendChild(resultsWrap);
      return;
    }
    if (isViewAllMode) {
      menuGrid.innerHTML = "";
      const allWrap = document.createElement("div");
      allWrap.className = "hub-view-all-wrap";
      const viewAllTitle = {
        fr: "Tous nos plats & sp\xE9cialit\xE9s",
        en: "All our dishes & specialties",
        de: "Alle unsere Gerichte & Spezialit\xE4ten",
        ar: "\u062C\u0645\u064A\u0639 \u0627\u0644\u0623\u0637\u0628\u0627\u0642 \u0648\u0627\u0644\u0645\u0634\u0631\u0648\u0628\u0627\u062A"
      };
      allWrap.innerHTML = `
      <div class="hub-section-header hub-view-all-header">
        <h2 class="hub-section-title">${viewAllTitle[currentLang] || viewAllTitle.fr}</h2>
      </div>
    `;
      menuData.forEach((cat) => {
        const catId = getCatId(cat);
        const catName = cat.category[currentLang] || cat.category.fr;
        const catSection = document.createElement("section");
        catSection.className = "hub-category-section";
        catSection.id = `cat-section-${catId}`;
        catSection.innerHTML = `
        <div class="hub-section-header">
          <div class="hub-header-left">
            <h3 class="hub-section-title">${catName}</h3>
            <span class="hub-section-count">${cat.items?.length || 0}</span>
          </div>
        </div>
        <div class="hub-dishes-grid"></div>
      `;
        const grid2 = catSection.querySelector(".hub-dishes-grid");
        (cat.items || []).forEach((item, idx) => {
          item.categoryId = catId;
          item.categoryNameFr = cat.category.fr;
          grid2.appendChild(createDishCard(item, catId, idx));
        });
        allWrap.appendChild(catSection);
      });
      menuGrid.appendChild(allWrap);
      return;
    }
    if (!activeCategoryId && menuData.length > 0) {
      activeCategoryId = getCatId(menuData[0]);
    }
    const activeCategory = menuData.find((c) => getCatId(c) === activeCategoryId) || menuData[0];
    if (!activeCategory) return;
    const currentCatId = getCatId(activeCategory);
    const catTitle = activeCategory.category[currentLang] || activeCategory.category.fr;
    const items = activeCategory.items || [];
    const voirToutTexts = {
      fr: "Voir tout",
      en: "View all",
      de: "Alle ansehen",
      ar: "\u0639\u0631\u0636 \u0627\u0644\u0643\u0644"
    };
    const countTexts = {
      fr: `${items.length} plats`,
      en: `${items.length} items`,
      de: `${items.length} Gerichte`,
      ar: `${items.length} \u0623\u0637\u0628\u0627\u0642`
    };
    menuGrid.innerHTML = `
    <div class="hub-single-category-wrap">
      <div class="hub-section-header">
        <div class="hub-header-left">
          <h2 class="hub-section-title">${catTitle}</h2>
          <span class="hub-section-count">${countTexts[currentLang] || countTexts.fr}</span>
        </div>
        <button type="button" class="hub-view-all-btn" id="hubViewAllBtn" aria-label="Voir tout le menu">
          <span>${voirToutTexts[currentLang] || voirToutTexts.fr}</span>
          <svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
        </button>
      </div>
      <div class="hub-dishes-grid"></div>
    </div>
  `;
    const btnViewAll = menuGrid.querySelector("#hubViewAllBtn");
    if (btnViewAll) {
      btnViewAll.addEventListener("click", showAllDishes);
    }
    const grid = menuGrid.querySelector(".hub-dishes-grid");
    items.forEach((item, idx) => {
      item.categoryId = currentCatId;
      item.categoryNameFr = activeCategory.category.fr;
      grid.appendChild(createDishCard(item, currentCatId, idx));
    });
  }
  function createDishCard(item, categoryId, itemIndex, categoryBadge = "") {
    const card = document.createElement("article");
    card.className = "hub-card menu-item";
    card.id = `item-${categoryId}-${itemIndex}`;
    card.style.setProperty("--item-index", itemIndex);
    card._menuItem = item;
    card.dataset.img = item.image;
    const itemName = item.name[currentLang] || item.name.fr || "";
    const itemDesc = item.description[currentLang] || item.description.fr || "";
    const badgeNewText = currentLang === "en" ? "NEW" : currentLang === "de" ? "NEU" : currentLang === "ar" ? "\u062C\u062F\u064A\u062F" : "NOUVEAU";
    const orderBtnText = currentLang === "en" ? "Order" : currentLang === "de" ? "Bestellen" : currentLang === "ar" ? "\u0627\u0637\u0644\u0628" : "Commander";
    card.innerHTML = `
    <div class="hub-card-media">
      <img src="${item.image}" alt="${itemName}" class="hub-card-img" loading="lazy" />
      <div class="hub-card-gradient"></div>
      ${item.isNew ? `<span class="hub-badge-new">${badgeNewText}</span>` : ""}
      ${categoryBadge ? `<span class="hub-badge-cat">${categoryBadge}</span>` : ""}
      <div class="hub-card-zoom-hint" title="Agrandir">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="11" y1="8" x2="11" y2="14"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
      </div>
    </div>
    <div class="hub-card-content">
      <div class="hub-card-header">
        <h3 class="hub-card-name item-name">${itemName}</h3>
      </div>
      ${itemDesc ? `<p class="hub-card-desc item-desc">${itemDesc}</p>` : ""}
      <div class="hub-card-footer">
        <div class="hub-card-price-wrap">
          <span class="hub-card-price item-price">${item.price}</span>
        </div>
        <button type="button" class="hub-order-btn add-to-cart-btn" aria-label="${orderBtnText}">
          <span class="hub-order-btn-label">${orderBtnText}</span>
          <svg class="hub-order-btn-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </button>
      </div>
    </div>
  `;
    return card;
  }
  function applySearchFilter() {
    const input = document.getElementById("searchInput");
    const clearBtn = document.getElementById("searchClearBtn");
    if (!input) return;
    const term = (input.value || "").trim();
    if (clearBtn) {
      clearBtn.style.display = term ? "flex" : "none";
    }
    renderDishes(term);
  }
  function activateSearch() {
    const searchInput = document.getElementById("searchInput");
    const clearBtn = document.getElementById("searchClearBtn");
    if (!searchInput) return;
    searchInput.removeEventListener("input", applySearchFilter);
    searchInput.addEventListener("input", applySearchFilter);
    if (clearBtn && !clearBtn._hasClickListener) {
      clearBtn._hasClickListener = true;
      clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        applySearchFilter();
        searchInput.focus();
      });
    }
  }
  function closeLightbox() {
    const secureLightbox = document.getElementById("secureLightbox");
    const secureLightboxContent = document.querySelector(".secure-lightbox-content");
    if (!secureLightbox) return;
    secureLightbox.classList.remove("active");
    if (secureLightboxContent) secureLightboxContent.style.backgroundImage = "";
    const lbAddBtn = document.getElementById("secureLightboxAddBtn");
    if (lbAddBtn) lbAddBtn.style.display = "none";
    const lbCaption = document.getElementById("secureLightboxCaption");
    if (lbCaption) lbCaption.textContent = "";
    document.body.classList.remove("no-scroll");
    document.documentElement.classList.remove("no-scroll");
  }
  function openLightboxForItem(item, imgUrl) {
    const secureLightbox = document.getElementById("secureLightbox");
    const secureLightboxContent = document.querySelector(".secure-lightbox-content");
    if (!secureLightbox || !secureLightboxContent || !imgUrl) return;
    const lbAddBtn = document.getElementById("secureLightboxAddBtn");
    const lbCaption = document.getElementById("secureLightboxCaption");
    activeLightboxItem = item;
    secureLightboxContent.style.backgroundImage = `url("${imgUrl}")`;
    if (item && lbCaption) {
      const name = item.name[currentLang] || item.name.fr;
      lbCaption.textContent = `${name} \u2014 ${item.price}`;
    } else if (lbCaption) {
      lbCaption.textContent = "";
    }
    if (item && lbAddBtn) {
      lbAddBtn.style.display = "block";
      const btnText = currentLang === "en" ? "Order" : currentLang === "de" ? "Bestellen" : currentLang === "ar" ? "\u0627\u0637\u0644\u0628" : "Commander";
      lbAddBtn.textContent = btnText;
    } else if (lbAddBtn) {
      lbAddBtn.style.display = "none";
    }
    secureLightbox.classList.add("active");
    document.body.classList.add("no-scroll");
    document.documentElement.classList.add("no-scroll");
  }
  function enableSecureLightbox() {
    const secureLightbox = document.getElementById("secureLightbox");
    const secureLightboxContent = document.querySelector(".secure-lightbox-content");
    if (!secureLightbox || !secureLightboxContent) return;
    const lbAddBtn = document.getElementById("secureLightboxAddBtn");
    if (lbAddBtn && !lbAddBtn._hasListener) {
      lbAddBtn._hasListener = true;
      lbAddBtn.addEventListener("click", () => {
        if (activeLightboxItem) {
          checkItemOptionsAndAdd(activeLightboxItem);
          closeLightbox();
        }
      });
    }
    const closeBtn = secureLightbox.querySelector(".close-btn");
    if (closeBtn && !closeBtn._hasListener) {
      closeBtn._hasListener = true;
      closeBtn.addEventListener("click", closeLightbox);
    }
    if (!secureLightbox._hasClickListener) {
      secureLightbox._hasClickListener = true;
      secureLightbox.addEventListener("click", (e) => {
        if (e.target === secureLightbox) {
          closeLightbox();
        }
      });
    }
  }
  function protectImages() {
    if (imagesProtected) return;
    document.addEventListener("contextmenu", (e) => {
      if (e.target.tagName === "IMG" || e.target.classList.contains("hub-card-media") || e.target.classList.contains("hub-cat-circle")) {
        e.preventDefault();
      }
    });
    imagesProtected = true;
  }
  function setupNavigationListeners() {
    const burgerLinks = document.querySelectorAll("#burgerNav a");
    burgerLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
          const targetId = href.substring(1);
          selectCategory(targetId);
        }
      });
    });
  }
  function renderMenu() {
    const menuGrid = document.getElementById("menu-grid");
    if (!menuData || !Array.isArray(menuData) || !menuGrid) {
      return;
    }
    if (!activeCategoryId && menuData.length > 0) {
      activeCategoryId = getCatId(menuData[0]);
    }
    renderCategoryPastilles();
    renderDishes();
    if (!menuGrid._hasDelegatedListener) {
      menuGrid._hasDelegatedListener = true;
      menuGrid.addEventListener("click", (e) => {
        const addBtn = e.target.closest(".hub-order-btn, .hub-add-btn, .add-to-cart-btn");
        if (addBtn) {
          e.stopPropagation();
          const card2 = addBtn.closest(".hub-card");
          if (card2 && card2._menuItem) {
            checkItemOptionsAndAdd(card2._menuItem);
            addBtn.style.transform = "scale(0.92)";
            setTimeout(() => {
              addBtn.style.transform = "";
            }, 180);
          }
          return;
        }
        const card = e.target.closest(".hub-card");
        if (card && card._menuItem) {
          openLightboxForItem(card._menuItem, card.dataset.img);
        }
      });
    }
    setupNavigationListeners();
    activateSearch();
    enableSecureLightbox();
    protectImages();
  }
  function toggleCategoryDrawer(drawerIdOrElement) {
    if (typeof drawerIdOrElement === "string") {
      selectCategory(drawerIdOrElement);
    }
  }
  function setupFloatingButtons() {
  }
  window.renderMenu = renderMenu;
  window.selectCategory = selectCategory;
  window.showAllDishes = showAllDishes;
  window.closeLightbox = closeLightbox;
  window.setupNavigationListeners = setupNavigationListeners;
  window.toggleCategoryDrawer = toggleCategoryDrawer;

  // js/ui/feedback.js
  var MANAGER_PHONE = "212666265160";
  var GOOGLE_REVIEW_URL = "https://g.page/r/CXF0QNm04m-ZEAE/review";
  var FEEDBACK_I18N = {
    fr: {
      fabLabel: "Avis & Service Client",
      fabSub: "Votre avis compte \u2022 R\xE9ponse imm\xE9diate du manager",
      fabCta: "Noter \u279C",
      title: "Votre avis compte pour nous",
      subtitle: "Comment s'est pass\xE9e votre exp\xE9rience chez Grey Corner ?",
      note1: "D\xE9cevant",
      note2: "Passable",
      note3: "Moyen",
      note4: "Tr\xE8s bien",
      note5: "Excellent !",
      stepUnhappyTitle: "Prise en charge imm\xE9diate",
      stepUnhappyText: "Nous sommes sinc\xE8rement d\xE9sol\xE9s. Notre manager prend personnellement en charge votre message sur WhatsApp pour vous r\xE9pondre dans la minute.",
      openWhatsAppBtn: "Contacter le Manager sur WhatsApp \u{1F4AC}",
      stepHappyTitle: "Merci infiniment ! \u{1F60D}",
      stepHappyText: "Votre satisfaction est notre plus belle r\xE9compense. Soutenez notre \xE9quipe en publiant votre avis 5 \xE9toiles sur Google !",
      googleBtn: "Publier mon avis sur Google \u2B50",
      whatsappHappyBtn: "Envoyer un message au Manager \u{1F4AC}",
      tableNone: "Non pr\xE9cis\xE9e",
      waUnhappyPrefix: "Bonjour Grey Corner, je vous \xE9cris suite \xE0 ma visite",
      waHappyPrefix: "Bonjour Grey Corner, f\xE9licitations pour votre accueil et votre service !",
      waRatingLabel: "Note",
      waTableLabel: "Table",
      waCommentPrompt: "Mon retour / commentaire : "
    },
    ar: {
      fabLabel: "\u0631\u0623\u064A\u0643\u0645 \u0648\u062E\u062F\u0645\u062A\u0643\u0645",
      fabSub: "\u0631\u0623\u064A\u0643\u0645 \u064A\u0647\u0645\u0646\u0627 \u2022 \u062A\u0648\u0627\u0635\u0644 \u0645\u0628\u0627\u0634\u0631 \u0645\u0639 \u0627\u0644\u0625\u062F\u0627\u0631\u0629",
      fabCta: "\u062A\u0642\u064A\u064A\u0645 \u279C",
      title: "\u0631\u0623\u064A\u0643\u0645 \u064A\u0647\u0645\u0646\u0627 \u062C\u062F\u0627\u064B",
      subtitle: "\u0643\u064A\u0641 \u0643\u0627\u0646\u062A \u062A\u062C\u0631\u0628\u062A\u0643\u0645 \u0627\u0644\u064A\u0648\u0645 \u0641\u064A \u063A\u0631\u064A \u0643\u0648\u0631\u0646\u0631 \u061F",
      note1: "\u0645\u062E\u064A\u0628 \u0644\u0644\u0623\u0645\u0644",
      note2: "\u0645\u0642\u0628\u0648\u0644",
      note3: "\u0645\u062A\u0648\u0633\u0637",
      note4: "\u062C\u064A\u062F \u062C\u062F\u0627\u064B",
      note5: "\u0645\u0645\u062A\u0627\u0632 !",
      stepUnhappyTitle: "\u062A\u0648\u0627\u0635\u0644 \u0645\u0628\u0627\u0634\u0631 \u0645\u0639 \u0627\u0644\u0625\u062F\u0627\u0631\u0629",
      stepUnhappyText: "\u0646\u0639\u062A\u0630\u0631 \u0628\u0634\u062F\u0629 \u0639\u0646 \u0623\u064A \u062A\u0642\u0635\u064A\u0631. \u0627\u0644\u0645\u0633\u0624\u0648\u0644 \u0627\u0644\u0645\u0628\u0627\u0634\u0631 \u062C\u0627\u0647\u0632 \u0627\u0644\u0622\u0646 \u0644\u0644\u0631\u062F \u0639\u0644\u064A\u0643\u0645 \u0639\u0628\u0631 \u0648\u0627\u062A\u0633\u0627\u0628 \u0648\u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0644\u0623\u0645\u0631 \u0641\u064A \u0627\u0644\u062D\u0627\u0644.",
      openWhatsAppBtn: "\u0627\u0644\u062A\u062D\u062F\u062B \u0645\u0639 \u0627\u0644\u0645\u062F\u064A\u0631 \u0639\u0628\u0631 \u0648\u0627\u062A\u0633\u0627\u0628 \u{1F4AC}",
      stepHappyTitle: "\u0634\u0643\u0631\u0627\u064B \u062C\u0632\u064A\u0644\u0627\u064B \u0644\u0643\u0645 ! \u{1F60D}",
      stepHappyText: "\u0633\u0639\u0627\u062F\u062A\u0643\u0645 \u0647\u064A \u0623\u0643\u0628\u0631 \u0645\u0643\u0627\u0641\u0623\u0629 \u0644\u0646\u0627. \u0633\u0627\u0639\u062F\u0648\u0627 \u0641\u0631\u064A\u0642\u0646\u0627 \u0628\u0645\u0634\u0627\u0631\u0643\u0629 \u062A\u0642\u064A\u064A\u0645\u0643\u0645 \u0627\u0644\u0645\u0645\u062A\u0627\u0632 5 \u0646\u062C\u0648\u0645 \u0639\u0644\u0649 \u062C\u0648\u062C\u0644 !",
      googleBtn: "\u0646\u0634\u0631 \u062A\u0642\u064A\u064A\u0645\u064A \u0639\u0644\u0649 \u062C\u0648\u062C\u0644 \u2B50",
      whatsappHappyBtn: "\u0625\u0631\u0633\u0627\u0644 \u0631\u0633\u0627\u0644\u0629 \u0634\u0643\u0631 \u0644\u0644\u0645\u062F\u064A\u0631 \u{1F4AC}",
      tableNone: "\u063A\u064A\u0631 \u0645\u062D\u062F\u062F\u0629",
      waUnhappyPrefix: "\u0645\u0631\u062D\u0628\u0627\u064B \u063A\u0631\u064A \u0643\u0648\u0631\u0646\u0631\u060C \u0623\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0643\u0645 \u0628\u062E\u0635\u0648\u0635 \u0632\u064A\u0627\u0631\u062A\u064A",
      waHappyPrefix: "\u0645\u0631\u062D\u0628\u0627\u064B \u063A\u0631\u064A \u0643\u0648\u0631\u0646\u0631\u060C \u0634\u0643\u0631\u0627\u064B \u0644\u0643\u0645 \u0639\u0644\u0649 \u062D\u0633\u0646 \u0627\u0644\u0627\u0633\u062A\u0642\u0628\u0627\u0644 \u0648\u0627\u0644\u062E\u062F\u0645\u0629 \u0627\u0644\u0631\u0627\u0642\u064A\u0629 !",
      waRatingLabel: "\u0627\u0644\u062A\u0642\u064A\u064A\u0645",
      waTableLabel: "\u0627\u0644\u0637\u0627\u0648\u0644\u0629",
      waCommentPrompt: "\u0645\u0644\u0627\u062D\u0638\u0627\u062A\u064A : "
    },
    en: {
      fabLabel: "Review & Customer Service",
      fabSub: "Your feedback matters \u2022 Immediate manager support",
      fabCta: "Rate \u279C",
      title: "Your feedback matters",
      subtitle: "How was your experience at Grey Corner today?",
      note1: "Disappointing",
      note2: "Fair",
      note3: "Average",
      note4: "Very good",
      note5: "Excellent!",
      stepUnhappyTitle: "Immediate Manager Support",
      stepUnhappyText: "We are truly sorry. Our manager is personally handling your feedback via WhatsApp to assist you within the minute.",
      openWhatsAppBtn: "Chat with Manager on WhatsApp \u{1F4AC}",
      stepHappyTitle: "Thank you so much! \u{1F60D}",
      stepHappyText: "Your satisfaction is our greatest reward. Please support our team by leaving a 5-star review on Google!",
      googleBtn: "Leave a 5-Star Review on Google \u2B50",
      whatsappHappyBtn: "Send a message to the Manager \u{1F4AC}",
      tableNone: "Not specified",
      waUnhappyPrefix: "Hello Grey Corner, I am writing regarding my visit",
      waHappyPrefix: "Hello Grey Corner, congratulations on your great welcome and service!",
      waRatingLabel: "Rating",
      waTableLabel: "Table",
      waCommentPrompt: "My feedback / comment: "
    },
    de: {
      fabLabel: "Feedback & Service",
      fabSub: "Ihre Meinung z\xE4hlt \u2022 Sofortige Manager-Antwort",
      fabCta: "Bewerten \u279C",
      title: "Ihre Meinung ist uns wichtig",
      subtitle: "Wie war Ihr Erlebnis heute bei Grey Corner?",
      note1: "Entt\xE4uschend",
      note2: "Ausreichend",
      note3: "Mittelm\xE4\xDFig",
      note4: "Sehr gut",
      note5: "Ausgezeichnet!",
      stepUnhappyTitle: "Direkter Manager-Support",
      stepUnhappyText: "Es tut uns aufrichtig leid. Unser Manager k\xFCmmert sich pers\xF6nlich \xFCber WhatsApp um Ihr Anliegen, um sofort zu reagieren.",
      openWhatsAppBtn: "Manager auf WhatsApp kontaktieren \u{1F4AC}",
      stepHappyTitle: "Vielen Dank! \u{1F60D}",
      stepHappyText: "Ihre Zufriedenheit ist unsere sch\xF6nste Belohnung. Unterst\xFCtzen Sie unser Team mit 5 Sternen auf Google!",
      googleBtn: "5-Sterne-Bewertung auf Google abgeben \u2B50",
      whatsappHappyBtn: "Nachricht an den Manager senden \u{1F4AC}",
      tableNone: "Nicht angegeben",
      waUnhappyPrefix: "Hallo Grey Corner, ich schreibe Ihnen bez\xFCglich meines Besuchs",
      waHappyPrefix: "Hallo Grey Corner, herzlichen Gl\xFCckwunsch zu Ihrem hervorragenden Service!",
      waRatingLabel: "Bewertung",
      waTableLabel: "Tisch",
      waCommentPrompt: "Mein Kommentar / Feedback: "
    }
  };
  var RATING_EMOJIS = {
    1: "\u{1F621}",
    2: "\u{1F641}",
    3: "\u{1F610}",
    4: "\u{1F642}",
    5: "\u{1F60D}"
  };
  var currentSelectedRating = null;
  function getFeedbackTexts() {
    return FEEDBACK_I18N[currentLang] || FEEDBACK_I18N.fr;
  }
  function openFeedbackModal() {
    const modal = document.getElementById("feedbackModal");
    if (!modal) return;
    currentSelectedRating = null;
    resetFeedbackModalView();
    updateFeedbackTexts();
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeFeedbackModal() {
    const modal = document.getElementById("feedbackModal");
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function resetFeedbackModalView() {
    const modal = document.getElementById("feedbackModal");
    if (modal) {
      modal.querySelectorAll(".fb-rate-btn").forEach((btn) => btn.classList.remove("selected"));
    }
    const stepRating = document.getElementById("fbStepRating");
    const stepUnhappy = document.getElementById("fbStepUnhappy");
    const stepHappy = document.getElementById("fbStepHappy");
    if (stepRating) stepRating.style.display = "block";
    if (stepUnhappy) stepUnhappy.style.display = "none";
    if (stepHappy) stepHappy.style.display = "none";
  }
  function updateFeedbackTexts() {
    const t2 = getFeedbackTexts();
    const fabLabel = document.querySelector(".fb-fab-label");
    if (fabLabel) fabLabel.textContent = t2.fabLabel;
    const fcbSub = document.getElementById("fcbSubText");
    if (fcbSub) fcbSub.textContent = t2.fabSub;
    const fcbCta = document.getElementById("fcbCtaText");
    if (fcbCta) fcbCta.textContent = t2.fabCta;
    const titleEl = document.getElementById("fbModalTitle");
    if (titleEl) titleEl.textContent = t2.title;
    const subtitleEl = document.getElementById("fbModalSubtitle");
    if (subtitleEl) subtitleEl.textContent = t2.subtitle;
    for (let i = 1; i <= 5; i++) {
      const lbl = document.getElementById(`fbRateLabel${i}`);
      if (lbl && t2[`note${i}`]) lbl.textContent = t2[`note${i}`];
    }
    const unhTitle = document.getElementById("fbUnhappyTitle");
    if (unhTitle) unhTitle.textContent = t2.stepUnhappyTitle;
    const unhText = document.getElementById("fbUnhappyText");
    if (unhText) unhText.textContent = t2.stepUnhappyText;
    const waBtn = document.getElementById("fbOpenWhatsAppBtn");
    if (waBtn) waBtn.textContent = t2.openWhatsAppBtn;
    const hapTitle = document.getElementById("fbHappyTitle");
    if (hapTitle) hapTitle.textContent = t2.stepHappyTitle;
    const hapText = document.getElementById("fbHappyText");
    if (hapText) hapText.textContent = t2.stepHappyText;
    const googleBtn = document.getElementById("fbGoogleReviewBtn");
    if (googleBtn) googleBtn.textContent = t2.googleBtn;
    const waHappyBtn = document.getElementById("fbWhatsAppHappyBtn");
    if (waHappyBtn) waHappyBtn.textContent = t2.whatsappHappyBtn;
  }
  function handleFeedbackRating(stars, clickedBtn) {
    currentSelectedRating = stars;
    const modal = document.getElementById("feedbackModal");
    if (modal) {
      modal.querySelectorAll(".fb-rate-btn").forEach((btn) => btn.classList.remove("selected"));
    }
    if (clickedBtn) {
      clickedBtn.classList.add("selected");
    }
    const stepRating = document.getElementById("fbStepRating");
    const stepUnhappy = document.getElementById("fbStepUnhappy");
    const stepHappy = document.getElementById("fbStepHappy");
    if (stepRating) stepRating.style.display = "none";
    if (stars <= 3) {
      if (stepUnhappy) stepUnhappy.style.display = "block";
      if (stepHappy) stepHappy.style.display = "none";
    } else {
      if (stepUnhappy) stepUnhappy.style.display = "none";
      if (stepHappy) stepHappy.style.display = "block";
    }
  }
  function buildWhatsAppUrl(stars, isHappy) {
    const t2 = getFeedbackTexts();
    const emoji = RATING_EMOJIS[stars] || "\u2B50";
    const starsStr = "\u2605".repeat(stars) + "\u2606".repeat(5 - stars);
    const tableVal = clientTable || window.clientTable || getUrlTableParam();
    const tableDisplay = tableVal ? `${tableVal}` : t2.tableNone;
    let message = "";
    if (!isHappy) {
      message = `${t2.waUnhappyPrefix} (${t2.waRatingLabel} : ${stars}/5 ${emoji} ${starsStr}).
`;
      message += `\u{1F4CD} ${t2.waTableLabel} : ${tableDisplay}

`;
      message += `${t2.waCommentPrompt}`;
    } else {
      message = `${t2.waHappyPrefix} (${t2.waRatingLabel} : ${stars}/5 ${emoji} ${starsStr}).
`;
      message += `\u{1F4CD} ${t2.waTableLabel} : ${tableDisplay}

`;
      message += `${t2.waCommentPrompt}`;
    }
    return `https://wa.me/${MANAGER_PHONE}?text=${encodeURIComponent(message)}`;
  }
  function getUrlTableParam() {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get("table") || params.get("t") || null;
    } catch (e) {
      return null;
    }
  }
  function syncActionBarState() {
    const bar = document.getElementById("clientActionBar");
    const isVisible = !!(bar && bar.style.display !== "none" && getComputedStyle(bar).display !== "none");
    document.body.classList.toggle("has-client-action-bar", isVisible);
  }
  function initFeedbackWidget() {
    const fab = document.getElementById("feedbackFab");
    if (fab) {
      fab.addEventListener("click", (e) => {
        e.preventDefault();
        openFeedbackModal();
      });
    }
    const modal = document.getElementById("feedbackModal");
    if (!modal) return;
    const closeBtn = document.getElementById("fbCloseModalBtn");
    if (closeBtn) {
      closeBtn.addEventListener("click", closeFeedbackModal);
    }
    const backdrop = modal.querySelector(".fb-modal-backdrop");
    if (backdrop) {
      backdrop.addEventListener("click", closeFeedbackModal);
    }
    modal.querySelectorAll(".fb-rate-btn[data-rating]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const rating = parseInt(btn.dataset.rating, 10);
        if (rating >= 1 && rating <= 5) {
          handleFeedbackRating(rating, btn);
        }
      });
    });
    const openWaBtn = document.getElementById("fbOpenWhatsAppBtn");
    if (openWaBtn && !openWaBtn._hasClickListener) {
      openWaBtn._hasClickListener = true;
      openWaBtn.addEventListener("click", () => {
        const waUrl = buildWhatsAppUrl(currentSelectedRating || 3, false);
        closeFeedbackModal();
        window.open(waUrl, "_blank", "noopener");
      });
    }
    const googleBtn = document.getElementById("fbGoogleReviewBtn");
    if (googleBtn && !googleBtn._hasClickListener) {
      googleBtn._hasClickListener = true;
      googleBtn.addEventListener("click", () => {
        closeFeedbackModal();
        window.open(GOOGLE_REVIEW_URL, "_blank", "noopener");
      });
    }
    const waHappyBtn = document.getElementById("fbWhatsAppHappyBtn");
    if (waHappyBtn && !waHappyBtn._hasClickListener) {
      waHappyBtn._hasClickListener = true;
      waHappyBtn.addEventListener("click", () => {
        const waUrl = buildWhatsAppUrl(currentSelectedRating || 5, true);
        closeFeedbackModal();
        window.open(waUrl, "_blank", "noopener");
      });
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) {
        closeFeedbackModal();
      }
    });
    updateFeedbackTexts();
    syncActionBarState();
    const bar = document.getElementById("clientActionBar");
    if (bar && typeof MutationObserver !== "undefined") {
      const observer = new MutationObserver(() => syncActionBarState());
      observer.observe(bar, { attributes: true, attributeFilter: ["style", "class"] });
    }
  }
  window.initFeedbackWidget = initFeedbackWidget;
  window.openFeedbackModal = openFeedbackModal;
  window.closeFeedbackModal = closeFeedbackModal;
  window.updateFeedbackTexts = updateFeedbackTexts;
  window.syncActionBarState = syncActionBarState;

  // js/main.js
  document.addEventListener("DOMContentLoaded", () => {
    const table = parseTableFromUrl();
    initClientCart();
    applyLanguageToStaticTexts();
    initFeedbackWidget();
    document.querySelectorAll(".lang-button[data-lang]").forEach((b) => {
      b.classList.toggle("active", b.dataset.lang === currentLang);
    });
    renderMenu();
    setupBurgerMenu();
    setupFloatingButtons();
    setupNotificationDrawer(() => clientTable);
    updatePrixInfo();
    updateCartUI();
    GPSService.init();
    const btt = document.getElementById("backToTop");
    if (btt) {
      window.addEventListener("scroll", () => {
        btt.classList.toggle("show", window.scrollY > 350);
      }, { passive: true });
      btt.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
    if (typeof dbService !== "undefined" && typeof dbService.onSystemFreezeChange === "function") {
      dbService.onSystemFreezeChange((frozen) => {
        window.systemFrozen = frozen;
        let banner = document.getElementById("clientFreezeBanner");
        const submitBtn = document.getElementById("cdSubmitBtn");
        if (frozen) {
          if (!banner) {
            banner = document.createElement("div");
            banner.id = "clientFreezeBanner";
            banner.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:99999;background:linear-gradient(135deg,#c0392b,#962d22);color:#fff;text-align:center;padding:10px 16px;font-family:'DM Sans',sans-serif;font-size:0.82rem;font-weight:600;box-shadow:0 4px 12px rgba(0,0,0,0.3);letter-spacing:0.02em;";
            banner.textContent = "\u23F3 Mode rush actif : La prise de commande est momentan\xE9ment suspendue. Merci de votre compr\xE9hension !";
            document.body.appendChild(banner);
          } else {
            banner.style.display = "block";
          }
          if (submitBtn) submitBtn.classList.add("frozen-disabled");
        } else {
          if (banner) banner.style.display = "none";
          if (submitBtn) submitBtn.classList.remove("frozen-disabled");
        }
      });
    }
    if (table) {
      subscribeToActiveWaiterEvents(table);
    }
    document.querySelectorAll(".lang-button[data-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.dataset.lang;
        if (setLanguage(lang)) {
          document.querySelectorAll(".lang-button[data-lang]").forEach((b) => {
            b.classList.toggle("active", b.dataset.lang === lang);
          });
          renderMenu();
          updateCartUI();
          updateFeedbackTexts();
          if (GPSService && GPSService.lastState) {
            GPSService.updateUI(GPSService.lastState);
          }
        }
      });
    });
    const tableBadge = document.getElementById("cdTableBadge");
    if (tableBadge) {
      tableBadge.addEventListener("click", showTableSelectorModal);
    }
    const btnCall = document.getElementById("cabCallWaiter");
    const btnWater = document.getElementById("cabRequestWater");
    const btnBill = document.getElementById("cabRequestBill");
    const btnOpenCart = document.getElementById("cabOpenCart");
    const btnCloseCart = document.getElementById("cdCloseBtn");
    const overlayCart = document.getElementById("cartDrawerOverlay");
    const btnSubmitOrder = document.getElementById("cdSubmitBtn");
    if (btnCall) btnCall.addEventListener("click", () => triggerQuickServiceCall(clientTable, "waiter"));
    if (btnWater) btnWater.addEventListener("click", () => triggerQuickServiceCall(clientTable, "water"));
    if (btnBill) btnBill.addEventListener("click", () => triggerQuickServiceCall(clientTable, "bill"));
    if (btnOpenCart) btnOpenCart.addEventListener("click", openCartDrawer);
    if (btnCloseCart) btnCloseCart.addEventListener("click", closeCartDrawer);
    if (overlayCart) overlayCart.addEventListener("click", closeCartDrawer);
    if (btnSubmitOrder) btnSubmitOrder.addEventListener("click", () => submitOrderOrWhatsApp(clientTable));
    const shareBtn = document.getElementById("shareMenu");
    if (shareBtn) {
      shareBtn.addEventListener("click", async () => {
        const url = window.location.href;
        const texts = {
          fr: { title: "Grey Corner \u2014 Menu", text: "\u{1F37D}\uFE0F D\xE9couvrez le menu Grey Corner Caf\xE9 \xE0 F\xE8s !" },
          en: { title: "Grey Corner \u2014 Menu", text: "\u{1F37D}\uFE0F Discover the Grey Corner Caf\xE9 menu in F\xE8s!" },
          de: { title: "Grey Corner \u2014 Men\xFC", text: "\u{1F37D}\uFE0F Entdecken Sie das Men\xFC des Grey Corner Caf\xE9 in F\xE8s!" },
          ar: { title: "Grey Corner \u2014 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0637\u0639\u0627\u0645", text: "\u{1F37D}\uFE0F \u0627\u0643\u062A\u0634\u0641 \u0642\u0627\u0626\u0645\u0629 \u0645\u0642\u0647\u0649 Grey Corner \u0641\u064A \u0641\u0627\u0633!" }
        };
        const tShare = texts[currentLang] || texts.fr;
        if (navigator.share) {
          try {
            await navigator.share({ title: tShare.title, text: tShare.text, url });
            return;
          } catch (e) {
          }
        }
        try {
          await navigator.clipboard.writeText(url);
        } catch {
          const ta = document.createElement("textarea");
          ta.value = url;
          ta.style.cssText = "position:fixed;opacity:0;top:0;left:0;";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
        }
        const toastMsg = {
          fr: "Lien copi\xE9 \u2713",
          en: "Link copied \u2713",
          de: "Link kopiert \u2713",
          ar: "\u062A\u0645 \u0646\u0633\u062E \u0627\u0644\u0631\u0627\u0628\u0637 \u2713"
        };
        const toast = document.getElementById("scToast");
        if (toast) {
          toast.textContent = toastMsg[currentLang] || toastMsg.fr;
          toast.classList.add("show");
          setTimeout(() => toast.classList.remove("show"), 2400);
        } else {
          showToast(toastMsg[currentLang] || toastMsg.fr);
        }
      });
    }
    console.log("\u{1F680} Main ES Module initialized successfully.");
  });
})();
