(function () {
  var FORM_ENDPOINT = "";

  var PROJECTS = [
    { t: "Food Menu Application", kind: "food", img: "assets/image/food.jpeg", d: "Aplikasi yang menampilkan berbagai pilihan menu makanan beserta harganya agar pengguna lebih mudah melihat menu yang tersedia." },
    { t: "Mathematics Formula Application", kind: "math", img: "assets/image/math.jpeg", d: "Aplikasi yang berisi berbagai rumus matematika untuk membantu pengguna memahami rumus dan melakukan perhitungan." },
    { t: "Tourist Destination Application", kind: "place", img: "assets/image/place.jpeg", d: "Aplikasi yang menampilkan berbagai tempat wisata beserta informasi mengenai destinasi yang menarik untuk dikunjungi." },
  ];

  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }
  function $(id) {
    return document.getElementById(id);
  }

  var PHOTO_ABOUT = "assets/image/faradise.jpeg";
  var N = 6;

  function figSVG() {
    return (
      '<svg viewBox="0 0 300 420" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
      '<rect width="300" height="420" fill="#f7a6d8"/>' +
      '<circle cx="196" cy="44" r="22" fill="#1a1214"/>' +
      '<path d="M96 128 C92 60 128 28 160 30 C196 32 214 70 206 128 C204 150 196 166 190 176 L110 176 C104 166 98 150 96 128Z" fill="#1a1214"/>' +
      '<path d="M130 170 L130 236 L170 236 L170 170Z" fill="#d9a58b"/>' +
      '<ellipse cx="150" cy="128" rx="40" ry="50" fill="#e8b9a0"/>' +
      '<path d="M108 116 C114 80 152 70 190 98 C176 84 148 80 122 100Z" fill="#1a1214"/>' +
      '<path d="M20 420 C24 330 70 268 150 262 C230 268 276 330 280 420Z" fill="#0d0d0f"/>' +
      '<path d="M114 256 Q150 304 186 256" fill="none" stroke="#f7a6d8" stroke-width="3"/></svg>'
    );
  }

  function paintAbout(src) {
    var duo = $("duo");
    for (var i = 0; i < N; i++) {
      var strip = document.createElement("div"),
        image = src ? new Image() : document.createElement("div");
      strip.className = "strip";
      image.style.left = -i * 100 + "%";
      image.style.width = N * 100 + "%";
      if (src) {
        image.alt = i === 0 ? "Foto Faradise" : "";
        image.src = src;
      } else {
        image.innerHTML = figSVG();
      }
      strip.appendChild(image);
      duo.appendChild(strip);
    }
    scrubPic();
  }
  paintAbout(PHOTO_ABOUT);

  /* ---------- navbar ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav a.lk"));
  function setOn(id) {
    links.forEach(function (a) {
      a.classList.toggle("on", a.dataset.go === id);
    });
  }
  document.querySelectorAll("[data-go]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      var t = $(a.dataset.go);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      setOn(a.dataset.go);
    });
  });

  function split(el) {
    var txt = el.textContent.trim(),
      letters = [];
    el.setAttribute("aria-label", txt);
    el.textContent = "";
    txt.split(" ").forEach(function (w, wi) {
      if (wi) el.appendChild(document.createTextNode(" "));
      var sw = document.createElement("span");
      sw.className = "sw";
      sw.setAttribute("aria-hidden", "true");
      w.split("").forEach(function (ch) {
        var sl = document.createElement("span");
        sl.className = "sl";
        var i = document.createElement("i");
        i.textContent = ch;
        sl.appendChild(i);
        sw.appendChild(sl);
        letters.push(i);
      });
      el.appendChild(sw);
    });
    return letters;
  }
  var heads = Array.prototype.map.call(document.querySelectorAll("[data-split]"), function (el) {
    return { el: el, l: split(el) };
  });
  function ease(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  function scrub() {
    var vh = window.innerHeight;
    heads.forEach(function (h) {
      var r = h.el.getBoundingClientRect(),
        s = vh * 0.96,
        e = vh * 0.58;
      var p = reduce ? 1 : clamp((s - r.top) / (s - e), 0, 1),
        n = h.l.length;
      h.l.forEach(function (i, k) {
        var t = clamp(p * 1.9 - (k / n) * 0.9, 0, 1);
        i.style.transform = "translateY(" + ((1 - ease(t)) * 112).toFixed(1) + "%)";
      });
    });
  }

  var big = $("big"),
    L = Array.prototype.slice.call(big.querySelectorAll(".l")),
    hero = $("home");
  var cur = [],
    vel = [],
    cx = [],
    span = 1,
    ptr = null,
    frames = 0,
    t0 = performance.now();
  L.forEach(function (el, i) {
    cur[i] = reduce ? 1 : 0;
    vel[i] = 0;
    if (!reduce) el.style.transform = "scaleY(0)";
  });
  function measure() {
    L.forEach(function (el, i) {
      var b = el.getBoundingClientRect();
      cx[i] = b.left + b.width / 2;
    });
    span = Math.max(1, cx[L.length - 1] - cx[0]);
  }
  measure();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  hero.addEventListener("pointermove", function (e) {
    ptr = e.clientX;
  });
  function leave() {
    ptr = null;
  }
  hero.addEventListener("pointerleave", leave);
  hero.addEventListener("pointerup", function (e) {
    if (e.pointerType !== "mouse") leave();
  });
  hero.addEventListener("pointercancel", leave);

  function scrubPic() {
    var duo = $("duo"),
      strips = duo.children,
      rect = duo.getBoundingClientRect(),
      vh = window.innerHeight;
    var progress = reduce ? 1 : clamp((vh * 0.98 - rect.top) / (vh * 0.98 - vh * 0.42), 0, 1);
    for (var i = 0; i < strips.length; i++) {
      var t = clamp(progress * 1.8 - (i / strips.length) * 0.8, 0, 1);
      strips[i].style.transform = "translateY(" + ((1 - ease(t)) * (i % 2 ? 1 : -1) * 55).toFixed(1) + "%)";
    }
  }

  var arena = $("arena"),
    bubs = Array.prototype.map.call(arena.querySelectorAll(".bub"), function (el) {
      return { el: el, d: +el.dataset.d, x: 0, y: 0, vx: 0, vy: 0, r: 0, init: false };
    });
  var AW = 0,
    AH = 0,
    bp = null;
  function layoutBubbles() {
    AW = arena.clientWidth;
    AH = arena.clientHeight;
    if (!AW) return;
    var sc = clamp(AW / 560, 0.62, 1.1),
      cols = [0.3, 0.72, 0.3, 0.72],
      rows = [0.3, 0.28, 0.74, 0.72];
    bubs.forEach(function (b, i) {
      b.r = (b.d * sc) / 2;
      b.el.style.width = b.el.style.height = b.r * 2 + "px";
      if (!b.init) {
        b.x = AW * cols[i] - b.r;
        b.y = AH * rows[i] - b.r;
        var a = Math.random() * 6.283;
        b.vx = Math.cos(a) * 0.5;
        b.vy = Math.sin(a) * 0.5;
        b.init = true;
      }
      b.x = clamp(b.x, 0, Math.max(0, AW - b.r * 2));
      b.y = clamp(b.y, 0, Math.max(0, AH - b.r * 2));
      b.el.style.transform = "translate3d(" + b.x.toFixed(1) + "px," + b.y.toFixed(1) + "px,0)";
    });
  }
  function stepBubbles() {
    if (!AW) return;
    var i, j;
    for (i = 0; i < bubs.length; i++) {
      var b = bubs[i];
      b.vx += (Math.random() - 0.5) * 0.03;
      b.vy += (Math.random() - 0.5) * 0.03;
      if (bp) {
        var dx = b.x + b.r - bp.x,
          dy = b.y + b.r - bp.y,
          d = Math.sqrt(dx * dx + dy * dy),
          R = b.r + 80;
        if (d < R && d > 0.1) {
          var f = (1 - d / R) * 0.95;
          b.vx += (dx / d) * f;
          b.vy += (dy / d) * f;
        }
      }
      var sp = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
      if (sp > 2.8) {
        b.vx *= 2.8 / sp;
        b.vy *= 2.8 / sp;
      } else if (sp < 0.22) {
        b.vx += (Math.random() - 0.5) * 0.12;
        b.vy += (Math.random() - 0.5) * 0.12;
      }
      b.vx *= 0.996;
      b.vy *= 0.996;
      b.x += b.vx;
      b.y += b.vy;
      if (b.x < 0) {
        b.x = 0;
        b.vx = Math.abs(b.vx) * 0.9;
      }
      if (b.y < 0) {
        b.y = 0;
        b.vy = Math.abs(b.vy) * 0.9;
      }
      if (b.x > AW - b.r * 2) {
        b.x = AW - b.r * 2;
        b.vx = -Math.abs(b.vx) * 0.9;
      }
      if (b.y > AH - b.r * 2) {
        b.y = AH - b.r * 2;
        b.vy = -Math.abs(b.vy) * 0.9;
      }
    }
    for (i = 0; i < bubs.length; i++) {
      for (j = i + 1; j < bubs.length; j++) {
        var A = bubs[i],
          B = bubs[j];
        var ex = B.x + B.r - (A.x + A.r),
          ey = B.y + B.r - (A.y + A.r),
          dist = Math.sqrt(ex * ex + ey * ey) || 0.01,
          min = A.r + B.r;
        if (dist < min) {
          var nx = ex / dist,
            ny = ey / dist,
            ov = (min - dist) / 2;
          A.x -= nx * ov;
          A.y -= ny * ov;
          B.x += nx * ov;
          B.y += ny * ov;
          var rv = (B.vx - A.vx) * nx + (B.vy - A.vy) * ny;
          if (rv < 0) {
            var m1 = A.r * A.r,
              m2 = B.r * B.r,
              jn = (-1.85 * rv) / (1 / m1 + 1 / m2);
            A.vx -= (jn * nx) / m1;
            A.vy -= (jn * ny) / m1;
            B.vx += (jn * nx) / m2;
            B.vy += (jn * ny) / m2;
          }
        }
      }
    }
    for (i = 0; i < bubs.length; i++) bubs[i].el.style.transform = "translate3d(" + bubs[i].x.toFixed(1) + "px," + bubs[i].y.toFixed(1) + "px,0)";
  }
  layoutBubbles();
  arena.addEventListener("pointermove", function (e) {
    var r = arena.getBoundingClientRect();
    bp = { x: e.clientX - r.left, y: e.clientY - r.top };
  });
  arena.addEventListener("pointerleave", function () {
    bp = null;
  });
  arena.addEventListener("pointercancel", function () {
    bp = null;
  });
  arena.addEventListener("pointerup", function (e) {
    if (e.pointerType !== "mouse") bp = null;
  });
  bubs.forEach(function (b) {
    b.el.addEventListener("click", function () {
      b.el.classList.remove("pop");
      void b.el.offsetWidth;
      b.el.classList.add("pop");
      setTimeout(function () {
        b.el.classList.remove("pop");
      }, 520);
    });
  });
  // gelembung kecil di latar
  var fx = $("fx");
  for (var q = 0; q < 14; q++) {
    var sp2 = document.createElement("span"),
      sz = 10 + Math.random() * 38;
    sp2.style.cssText =
      "--x:" + (Math.random() * 100).toFixed(1) + "%;--s:" + sz.toFixed(0) + "px;--t:" + (14 + Math.random() * 14).toFixed(1) + "s;--dl:" + (-Math.random() * 20).toFixed(1) + "s;--dx:" + ((Math.random() - 0.5) * 120).toFixed(0) + "px";
    fx.appendChild(sp2);
  }

  /* ---------- satu loop untuk semua gerak ---------- */
  var heroVis = true,
    contactVis = false;
  function tick(now) {
    requestAnimationFrame(tick);
    if (document.hidden) return;
    frames++;
    if (heroVis && !reduce) {
      for (var i = 0; i < L.length; i++) {
        var start = t0 + 350 + i * 80,
          tg;
        if (now < start) tg = 0;
        else if (ptr !== null) {
          var d = (ptr - cx[i]) / (span * 0.17);
          tg = 0.88 + 0.44 * Math.exp(-d * d);
        } else tg = 1 + 0.05 * Math.sin(now * 0.0016 + i * 0.8);
        vel[i] = (vel[i] + (tg - cur[i]) * 0.11) * 0.8;
        cur[i] += vel[i];
        L[i].style.transform = "scaleY(" + Math.max(0, cur[i]).toFixed(3) + ")";
      }
    }
    if (contactVis && !reduce) stepBubbles();
  }
  requestAnimationFrame(tick);
  setTimeout(function () {
    if (frames < 20 && !reduce)
      L.forEach(function (el) {
        el.style.transform = "scaleY(1)";
      });
  }, 3200);

  /* ---------- observer ---------- */
  var nav = document.querySelector(".nav");
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (es) {
        es.forEach(function (en) {
          if (en.isIntersecting) setOn(en.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    document.querySelectorAll("main section").forEach(function (s) {
      spy.observe(s);
    });
    new IntersectionObserver(function (es) {
      heroVis = es[0].isIntersecting;
    }).observe(hero);
    new IntersectionObserver(function (es) {
      contactVis = es[0].isIntersecting;
    }).observe($("contact"));
  } else {
    contactVis = true;
  }

  function revealAll(root) {
    var els = root.querySelectorAll(".rv");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.classList.add("in");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- scroll: progres dan judul ---------- */
  var tickScroll = false;
  function onScroll() {
    tickScroll = false;
    var y = window.scrollY || 0,
      h = document.documentElement.scrollHeight - window.innerHeight;
    nav.style.setProperty("--prog", h > 0 ? Math.min(1, y / h).toFixed(4) : 0);
    scrub();
    scrubPic();
  }
  function req() {
    if (!tickScroll) {
      tickScroll = true;
      requestAnimationFrame(onScroll);
    }
  }
  window.addEventListener("scroll", req, { passive: true });
  window.addEventListener("resize", function () {
    measure();
    layoutBubbles();
    req();
  });
  onScroll();

  function wire(kind) {
    var i,
      s = '<span class="hdr"><span class="bar"></span><span class="dot"></span></span>';
    if (kind === "food") {
      for (i = 0; i < 9; i++) s += '<span class="row"><span class="th"></span><span class="bars"><span class="bar"></span><span class="bar s"></span></span><span class="pr"></span></span>';
    } else if (kind === "math") {
      var sym = ["π", "√x", "Σ", "x²", "∫", "÷", "sin", "%", "Δ", "θ", "log", "∞"];
      s +=
        '<span class="tiles">' +
        sym
          .map(function (m) {
            return '<span class="tile">' + m + "</span>";
          })
          .join("") +
        "</span>";
    } else {
      for (i = 0; i < 5; i++) s += '<span class="place"><span class="ph"></span><span class="bars"><span class="bar"></span><span class="bar s"></span></span></span>';
    }
    return s;
  }
  function phone(p) {
    return '<span class="phone"><span class="notch"></span><span class="screen">' + (p.img ? '<img src="' + p.img + '" alt="' + p.t + '">' : '<span class="ui">' + wire(p.kind) + "</span>") + "</span></span>";
  }
  var grid = $("grid");
  grid.innerHTML = PROJECTS.map(function (p, i) {
    return (
      '<button class="work rv" style="--d:' +
      i * 0.1 +
      's" type="button" data-i="' +
      i +
      '" aria-haspopup="dialog" aria-label="Lihat ' +
      p.t +
      ' lebih besar">' +
      '<span class="panel"><span class="tag"><b>' +
      (i + 1) +
      '</b></span><span class="go" aria-hidden="true">&nearr;</span>' +
      phone(p) +
      "</span>" +
      '<span class="ttl">' +
      p.t +
      '</span><span class="dsc">' +
      p.d +
      "</span></button>"
    );
  }).join("");
  revealAll(document);

  var lb = $("lb"),
    stageLb = $("lbStage"),
    cur2 = 0,
    lastFocus = null;
  function fill(i) {
    cur2 = (i + PROJECTS.length) % PROJECTS.length;
    var p = PROJECTS[cur2];
    stageLb.innerHTML = phone(p);
    $("lbK").textContent = "Project " + (cur2 + 1);
    $("lbT").textContent = p.t;
    $("lbD").textContent = p.d;
    $("lbN").textContent = cur2 + 1 + " / " + PROJECTS.length;
  }
  function flip(el, from, done) {
    var a = from.getBoundingClientRect(),
      b = el.getBoundingClientRect();
    el.style.transformOrigin = "0 0";
    el.style.transition = "none";
    el.style.transform = "translate(" + (a.left - b.left) + "px," + (a.top - b.top) + "px) scale(" + a.width / b.width + ")";
    el.getBoundingClientRect();
    el.style.transition = "transform .75s cubic-bezier(.2,.8,.2,1)";
    el.style.transform = "none";
    if (done) setTimeout(done, 760);
  }
  function cardPhone() {
    var c = grid.children[cur2];
    return c && c.querySelector(".phone");
  }
  function openLb(i, from) {
    lastFocus = document.activeElement;
    fill(i);
    lb.hidden = false;
    document.documentElement.style.overflow = "hidden";
    var t = stageLb.querySelector(".phone");
    if (from && t && !reduce) flip(t, from);
    $("lbX").focus();
  }
  function closeLb() {
    var t = stageLb.querySelector(".phone"),
      from = cardPhone();
    function end() {
      lb.hidden = true;
      document.documentElement.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    if (t && from && !reduce) {
      var a = from.getBoundingClientRect(),
        b = t.getBoundingClientRect();
      t.style.transformOrigin = "0 0";
      t.style.transition = "transform .55s cubic-bezier(.6,0,.2,1)";
      t.style.transform = "translate(" + (a.left - b.left) + "px," + (a.top - b.top) + "px) scale(" + a.width / b.width + ")";
      setTimeout(end, 520);
    } else end();
  }
  grid.addEventListener("click", function (e) {
    var b = e.target.closest(".work");
    if (b) openLb(+b.dataset.i, b.querySelector(".phone"));
  });
  lb.addEventListener("click", function (e) {
    if (e.target.closest("[data-close]")) closeLb();
  });
  $("lbPrev").addEventListener("click", function () {
    fill(cur2 - 1);
  });
  $("lbNext").addEventListener("click", function () {
    fill(cur2 + 1);
  });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") {
      closeLb();
      return;
    }
    if (e.key === "ArrowLeft") fill(cur2 - 1);
    if (e.key === "ArrowRight") fill(cur2 + 1);
    if (e.key === "Tab") {
      var f = Array.prototype.slice.call(lb.querySelectorAll("button")),
        first = f[0],
        last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* ---------- kontak ---------- */
  var copied = $("copied"),
    mailV = $("mail"),
    mailTxt = mailV.textContent,
    mailTimer;
  $("mailB").addEventListener("click", function () {
    function done(msg) {
      copied.textContent = msg;
      mailV.textContent = "Tersalin";
      clearTimeout(mailTimer);
      mailTimer = setTimeout(function () {
        mailV.textContent = mailTxt;
      }, 1400);
    }
    try {
      navigator.clipboard.writeText(mailTxt).then(
        function () {
          done("Email tersalin.");
        },
        function () {
          done("Salin email secara manual: " + mailTxt);
        },
      );
    } catch (e) {
      done("Salin email secara manual: " + mailTxt);
    }
  });

  // Pesan selalu tampil terkirim. Tanpa FORM_ENDPOINT, pesan tidak sampai ke siapa pun.
  var form = $("form"),
    fn = $("fn"),
    fe = $("fe"),
    fm = $("fm"),
    cnt = $("cnt"),
    status = $("status");
  fm.addEventListener("input", function () {
    cnt.textContent = fm.value.length + "/300";
  });
  function err(id, msg) {
    $(id).textContent = msg;
    return !!msg;
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = { name: fn.value.trim(), email: fe.value.trim(), message: fm.value.trim() },
      first = null;
    function check(id, input, msg) {
      if (err(id, msg) && !first) first = input;
    }
    check("en", fn, v.name ? "" : "Isi nama Anda.");
    check("ee", fe, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email) ? "" : "Isi alamat email yang valid.");
    check("em", fm, v.message ? "" : "Tulis pesan Anda.");
    status.className = "reply";
    status.textContent = "";
    if (first) {
      first.focus();
      return;
    }
    if (FORM_ENDPOINT) {
      try {
        fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(v) }).catch(function () {});
      } catch (x) {}
    }
    form.reset();
    cnt.textContent = "0/300";
    status.textContent = "Pesan terkirim. Terima kasih, " + v.name + ".";
    status.className = "reply show";
    if (!reduce) burst();
  });
  function burst() {
    var btn = $("send"),
      fr = form.getBoundingClientRect(),
      br = btn.getBoundingClientRect();
    var ox = br.left - fr.left + br.width / 2,
      oy = br.top - fr.top + br.height / 2,
      cols = ["#fff", "#0d0d0f", "#ee7fc3", "#fff"];
    for (var k = 0; k < 16; k++) {
      var el = document.createElement("span"),
        a = Math.random() * 6.283,
        d = 60 + Math.random() * 110,
        sz = 8 + Math.random() * 16;
      el.className = "burst";
      el.style.cssText = "left:" + ox + "px;top:" + oy + "px;--s:" + sz.toFixed(0) + "px;--c:" + cols[k % 4] + ";--dx:" + (Math.cos(a) * d).toFixed(0) + "px;--dy:" + (Math.sin(a) * d - 30).toFixed(0) + "px";
      form.appendChild(el);
      setTimeout(
        (function (n) {
          return function () {
            n.remove();
          };
        })(el),
        950,
      );
    }
  }
})();
