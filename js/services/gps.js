/**
 * GREY CORNER — INTELLIGENT GPS GEOFENCING & SECURITY SERVICE (ES Module)
 */

import { currentLang } from './i18n.js';

export const GeoFenceManager = {
  CENTER_LAT: 34.0344054,
  CENTER_LNG: -5.0154828,
  ALLOWED_RADIUS: 50, // meters

  calculateDistance(lat1, lon1, lat2, lon2) {
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

  isWithinGeofence(lat, lng) {
    const dist = this.calculateDistance(this.CENTER_LAT, this.CENTER_LNG, lat, lng);
    console.log(`📏 Distance to Grey Corner center: ${dist.toFixed(1)} meters.`);
    return dist <= this.ALLOWED_RADIUS;
  }
};

export const LocationSecurityManager = {
  lastCoords: null,
  lastTimestamp: null,

  isMockLocation(coords) {
    if (coords.accuracy === 0) {
      console.warn("⚠️ GPS Security Warning: Accuracy of 0 is suspicious (Mocked GPS).");
      return true;
    }
    if (this.lastCoords && this.lastTimestamp) {
      const timeDiff = (Date.now() - this.lastTimestamp) / 1000;
      if (timeDiff > 0) {
        const distanceMoved = GeoFenceManager.calculateDistance(
          this.lastCoords.latitude, this.lastCoords.longitude,
          coords.latitude, coords.longitude
        );
        const speedKmh = (distanceMoved / timeDiff) * 3.6;
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

export const GPSService = {
  isInside: false,
  isSuspicious: false,
  permissionState: 'prompt',
  timer: null,

  init() {
    console.log("🛰️ Initializing GPSService...");
    this.checkLocation(true);
    this.timer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.checkLocation(false);
      }
    }, 30000);
  },

  checkLocation(isStartup = false, callback = null) {
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

  handleError(msg) {
    this.isInside = false;
    if (this.permissionState === 'denied') {
      this.updateUI('denied');
    } else {
      this.updateUI('error');
    }
  },

  updateUI(state) {
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

  toggleInteractiveControls(enable) {
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

    const actionBar = document.getElementById("clientActionBar");
    if (actionBar) {
      actionBar.style.display = "block";
    }
  }
};

window.GeoFenceManager = GeoFenceManager;
window.LocationSecurityManager = LocationSecurityManager;
window.GPSService = GPSService;
