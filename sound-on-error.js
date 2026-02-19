(function () {
  // --- Synthesize an error beep using the Web Audio API (no external file needed) ---
  function playErrorSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();

      // First beep
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.type = "square";
      osc1.frequency.setValueAtTime(880, ctx.currentTime);
      gain1.gain.setValueAtTime(0.3, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.3);

      // Second beep
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = "square";
      osc2.frequency.setValueAtTime(660, ctx.currentTime + 0.35);
      gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.35);
      gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.65);
      osc2.start(ctx.currentTime + 0.35);
      osc2.stop(ctx.currentTime + 0.65);
    } catch (e) {
      console.warn("[ErrorSoundAlert] Web Audio API not available:", e);
    }
  }

  // --- The exact error string to watch for ---
  const ERROR_TEXT =
    "Sorry, the provider of this model has rejected your request (Message: This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.). Please try again or contact support.";

  // --- Use a MutationObserver to watch the entire app for injected error messages ---
  const observer = new MutationObserver(function (mutations) {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;

        // Check the node itself and all its descendants
        const text =
          node.textContent || node.innerText || "";
        if (text.includes(ERROR_TEXT)) {
          playErrorSound();
          // No need to check further nodes in this batch
          return;
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  console.log("[ErrorSoundAlert] Extension loaded and watching for errors.");
})();
