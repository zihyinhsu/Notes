import { defineComponent as S, ref as I, computed as v, watch as $, openBlock as f, createElementBlock as _, normalizeClass as L, unref as p, createElementVNode as s, toDisplayString as y, Fragment as b, renderList as A, createCommentVNode as M, nextTick as V, createVNode as q, render as B } from "vue";
let g;
const x = (a, r) => new Promise((e, l) => {
  cancelAnimationFrame(g), a.volume = r ? 0 : 1;
  let i = !1, c = 30;
  const m = () => {
    a.volume = Math.min(Math.max(a.volume + (r ? c : -c) / 1e3, 0), 1), i = a.volume === 1 || a.volume === 0, i ? e(a.volume) : (c = Math.max(c - 1, 5), g = requestAnimationFrame(m));
  };
  g = requestAnimationFrame(m);
});
const E = { class: "vitepress-music__drawer" }, T = { class: "vitepress-music__drawer-header" }, j = /* @__PURE__ */ s("span", null, "Playlist", -1), R = { class: "vitepress-music__drawer-content" }, z = ["onClick"], D = { class: "vitepress-music__trigger" }, G = ["src"], H = /* @__PURE__ */ S({
  __name: "template",
  props: {
    list: null
  },
  setup(a) {
    const r = a, e = I({
      status: 2,
      showList: !1,
      currentIndex: 0,
      errorIndexList: []
    }), l = v(() => r.list.filter((t) => !t.hide)), i = v(() => e.value.status === 0), c = v(() => e.value.status === 1), m = v(() => e.value.status === 2), P = v(() => ({
      "is-play": i.value,
      "is-pause": c.value,
      "is-stop": m.value,
      "is-show-list": e.value.showList
    })), F = v(() => l.value[e.value.currentIndex]), k = () => {
      e.value.status = i.value ? 1 : 0;
    }, C = () => {
      e.value.showList = !e.value.showList;
    }, u = I(), d = (t) => {
      if (t === e.value.currentIndex)
        return k();
      e.value.status = 2, e.value.currentIndex = t < 0 ? l.value.length - 1 : t > l.value.length - 1 ? 0 : t, V(() => e.value.status = 0);
    }, N = () => {
      const { errorIndexList: t, currentIndex: n } = e.value;
      t.includes(n) || t.push(n), t.length < l.value.length && d(n + 1);
    };
    return $(() => e.value.status, async (t) => {
      switch (t) {
        case 0:
          u.value.play(), x(u.value, !0);
          break;
        case 1:
          await x(u.value, !1), u.value.pause();
          break;
        case 2:
          await x(u.value, !1), u.value.pause();
          break;
      }
    }), (t, n) => {
      var w;
      return f(), _("div", {
        class: L(["vitepress-music", p(P)])
      }, [
        s("div", E, [
          s("div", T, [
            s("div", null, [
              s("span", {
                class: "iconfont icon-shouqi",
                onClick: C
              }),
              j
            ]),
            s("span", null, "Total " + y(((w = p(l)) == null ? void 0 : w.length) || 0), 1)
          ]),
          s("ul", R, [
            (f(!0), _(b, null, A(p(l), (o, h) => (f(), _(b, null, [
              o.hide ? M("", !0) : (f(), _("li", {
                key: o.name,
                class: L({
                  active: e.value.currentIndex === h,
                  error: e.value.errorIndexList.includes(h),
                  playing: p(i) && e.value.currentIndex === h
                }),
                onClick: (J) => d(h)
              }, [
                s("div", null, y(o.name), 1),
                s("div", null, y(o.author), 1)
              ], 10, z))
            ], 64))), 256))
          ])
        ]),
        s("div", D, [
          s("span", {
            class: "iconfont icon-changpianji",
            onClick: k
          }),
          s("span", {
            class: "iconfont icon-shangyishou",
            onClick: n[0] || (n[0] = (o) => d(e.value.currentIndex - 1))
          }),
          s("span", {
            class: "iconfont icon-xiayishou",
            onClick: n[1] || (n[1] = (o) => d(e.value.currentIndex + 1))
          }),
          s("span", {
            class: "iconfont icon-gedan",
            onClick: C
          })
        ]),
        s("audio", {
          ref_key: "audioRef",
          ref: u,
          src: p(F).file,
          controls: "controls",
          preload: "auto",
          onEnded: n[2] || (n[2] = (o) => d(e.value.currentIndex + 1)),
          onError: n[3] || (n[3] = (o) => N())
        }, null, 40, G)
      ], 2);
    };
  }
});
const O = (a = []) => {
  if (typeof window > "u")
    return;
  document.getElementsByTagName("body")[0];
  const r = q(H, {
    list: a
  }), e = document.createElement("div");
  B(r, e), document.body.appendChild(e);
};
export {
  O as default
};
//# sourceMappingURL=vitepress-plugin-music.js.map
