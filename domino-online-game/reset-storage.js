// Script per pulire il localStorage del browser
// Esegui questo script nella console del browser per resettare lo storage

console.log("Pulizia storage di Domino Online...");

// Pulisce il localStorage
if (typeof localStorage !== 'undefined') {
  // Rimuovi lo storage di Zustand
  localStorage.removeItem('domino-storage');
  
  // Rimuovi altri possibili storage
  localStorage.removeItem('gamification-storage');
  localStorage.removeItem('game-storage');
  
  console.log("✅ Storage pulito con successo!");
  console.log("🔄 Ricarica la pagina per vedere i cambiamenti.");
  
  // Ricarica automaticamente la pagina
  setTimeout(() => {
    window.location.reload();
  }, 1000);
} else {
  console.log("❌ localStorage non disponibile in questo ambiente");
}
