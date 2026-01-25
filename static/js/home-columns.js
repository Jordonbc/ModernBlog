(() => {
  const root = document.querySelector(".gn-home");
  if (!root) {
    return;
  }

  const list = root.querySelector(".gn-post-list");
  const titleEl = document.querySelector("#gn-article-title");
  const titleLink = document.querySelector("#gn-article-link");
  const metaEl = document.querySelector("#gn-article-meta");
  const contentEl = document.querySelector("#gn-article-content");

  if (!list || !titleEl || !titleLink || !metaEl || !contentEl) {
    return;
  }

  const setActive = (href) => {
    const items = list.querySelectorAll("li");
    items.forEach((item) => item.classList.remove("is-active"));
    const link = list.querySelector(`a[href="${href}"]`);
    if (link && link.parentElement) {
      link.parentElement.classList.add("is-active");
    }
  };

  const loadPost = async (href, pushState) => {
    try {
      contentEl.setAttribute("data-loading", "true");
      const response = await fetch(href, { credentials: "same-origin" });
      if (!response.ok) {
        window.location.href = href;
        return;
      }
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const post = doc.querySelector("article.post-single");
      if (!post) {
        window.location.href = href;
        return;
      }

      const nextTitle = post.querySelector(".post-title") || post.querySelector("h1");
      const nextMeta = post.querySelector(".post-meta");
      const nextContent = post.querySelector(".post-content");

      if (!nextTitle || !nextContent) {
        window.location.href = href;
        return;
      }

      titleEl.textContent = nextTitle.textContent || "";
      titleLink.setAttribute("href", href);
      metaEl.innerHTML = nextMeta ? nextMeta.innerHTML : "";
      contentEl.innerHTML = nextContent.innerHTML;

      if (pushState) {
        history.pushState({ href }, "", href);
      }

      document.title = doc.title || document.title;
      setActive(href);
    } finally {
      contentEl.removeAttribute("data-loading");
    }
  };

  list.addEventListener("click", (event) => {
    const target = event.target.closest("[data-gn-post-link]");
    if (!target) {
      return;
    }
    event.preventDefault();
    const href = target.getAttribute("href");
    if (!href) {
      return;
    }
    loadPost(href, true);
  });

  titleLink.addEventListener("click", (event) => {
    event.preventDefault();
  });

  window.addEventListener("popstate", () => {
    if (window.location.pathname === "/") {
      return;
    }
    loadPost(window.location.pathname, false);
  });
})();
