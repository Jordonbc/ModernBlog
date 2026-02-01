(() => {
  const BLOCK_SELECTOR = ".content .highlight, .content pre";
  const buttonLabel = "Copy";
  const copiedLabel = "Copied";
  const copyIcon =
    "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16h-9V7h9v14z\"/></svg>";
  const checkIcon =
    "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M9.55 17.2 4.8 12.45l1.4-1.4 3.35 3.35 8.3-8.3 1.4 1.4-9.7 9.7z\"/></svg>";

  const getCodeText = (block) => {
    const code = block.querySelector("code");
    if (!code) {
      return block.textContent || "";
    }
    const clone = code.cloneNode(true);
    clone.querySelectorAll(".ln, .lnt").forEach((node) => node.remove());
    return clone.textContent || "";
  };

  const copyText = async (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const fallback = document.createElement("textarea");
    fallback.value = text;
    fallback.setAttribute("readonly", "true");
    fallback.style.position = "absolute";
    fallback.style.left = "-9999px";
    document.body.appendChild(fallback);
    fallback.select();
    const success = document.execCommand("copy");
    document.body.removeChild(fallback);
    return success;
  };

  const createButton = (block) => {
    if (block.dataset.codeCopy === "true") {
      return;
    }
    block.dataset.codeCopy = "true";
    block.classList.add("has-code-copy");
    if (!block.style.position || block.style.position === "static") {
      block.style.position = "relative";
    }
    if (!block.style.boxSizing) {
      block.style.boxSizing = "border-box";
    }

    const ensureWrapper = () => {
      const parent = block.parentElement;
      if (parent && parent.classList.contains("code-copy-wrapper")) {
        return parent;
      }
      const wrapper = document.createElement("div");
      wrapper.className = "code-copy-wrapper";
      wrapper.style.position = "relative";
      wrapper.style.display = "block";
      wrapper.style.width = "100%";
      if (block.parentNode) {
        block.parentNode.insertBefore(wrapper, block);
        wrapper.appendChild(block);
      }
      return wrapper;
    };

    const button = document.createElement("button");
    button.type = "button";
    button.className = "code-copy-button";
    button.setAttribute("aria-label", buttonLabel);
    button.setAttribute("title", buttonLabel);
    button.innerHTML = copyIcon;

    button.addEventListener("click", async () => {
      const text = getCodeText(block).trimEnd();
      if (!text) {
        return;
      }
      try {
        await copyText(text);
        button.classList.add("is-copied");
        button.setAttribute("aria-label", copiedLabel);
        button.setAttribute("title", copiedLabel);
        button.innerHTML = checkIcon;
        window.setTimeout(() => {
          button.classList.remove("is-copied");
          button.setAttribute("aria-label", buttonLabel);
          button.setAttribute("title", buttonLabel);
          button.innerHTML = copyIcon;
        }, 1800);
      } catch (error) {
        button.classList.remove("is-copied");
        button.setAttribute("aria-label", buttonLabel);
        button.setAttribute("title", buttonLabel);
        button.innerHTML = copyIcon;
      }
    });

    const wrapper = ensureWrapper();
    if (wrapper) {
      wrapper.appendChild(button);
    } else {
      block.appendChild(button);
    }
  };

  const installButtons = (root = document) => {
    root.querySelectorAll(BLOCK_SELECTOR).forEach((block) => {
      if (block.matches("pre") && block.closest(".highlight")) {
        return;
      }
      createButton(block);
    });
  };

  const observeChanges = () => {
    const target = document.body;
    if (!target || !window.MutationObserver) {
      return;
    }
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) {
        return;
      }
      scheduled = true;
      window.requestAnimationFrame(() => {
        installButtons();
        scheduled = false;
      });
    });
    observer.observe(target, { childList: true, subtree: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      installButtons();
      observeChanges();
    });
  } else {
    installButtons();
    observeChanges();
  }
})();
