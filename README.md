# Modo oscuro

Extensión para navegadores Chromium. Guarda modo Normal u Oscuro por dominio (`hostname`). `http` y `https` del mismo dominio comparten la elección. `www` y el dominio sin `www` son entradas distintas.

Si el dominio no está guardado, la página no cambia. Elegir un modo lo guarda y lo aplica en la pestaña actual. La lista de sitios permite ver el modo, cambiarlo o borrar la entrada. Borrar devuelve el dominio a “no guardado”.

El modo oscuro invierte la página con CSS (`invert` + `hue-rotate`) y vuelve a invertir imágenes, video, canvas e iframes. No recoloréa píxel a píxel. Un sitio que ya es oscuro puede quedar lavado: en ese dominio elige Normal.

## Cargar sin empaquetar

1. Abre `chrome://extensions` (en Edge, `edge://extensions`).
2. Activa el modo de desarrollador.
3. Elige “Cargar descomprimida” y selecciona esta carpeta.
4. Recarga las pestañas que ya estaban abiertas. El content script entra al cargar la página.

`chrome://`, `edge://`, la pestaña nueva y Chrome Web Store no se pueden modificar. El popup lo indica.

La primera visita a un origen puede mostrar un instante la página clara antes de aplicar el modo guardado. Las visitas siguientes de ese mismo origen usan una caché en `localStorage` para pintar antes. La fuente de verdad sigue siendo `chrome.storage.local`, así que http y https quedan alineados en cuanto responde el almacenamiento.
