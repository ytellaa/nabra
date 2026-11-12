/* @ds-bundle: {"format":4,"namespace":"NodalDesignSystem_2d90b7","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"NodeDivider","sourcePath":"components/brand/NodeDivider.jsx"},{"name":"Card","sourcePath":"components/cards/Card.jsx"},{"name":"MediaCard","sourcePath":"components/cards/MediaCard.jsx"},{"name":"PricingCard","sourcePath":"components/cards/PricingCard.jsx"},{"name":"TestimonialCard","sourcePath":"components/cards/TestimonialCard.jsx"},{"name":"CtaBanner","sourcePath":"components/content/CtaBanner.jsx"},{"name":"FaqItem","sourcePath":"components/content/FaqItem.jsx"},{"name":"HeroBand","sourcePath":"components/content/HeroBand.jsx"},{"name":"LogoWall","sourcePath":"components/content/LogoWall.jsx"},{"name":"ComparisonTable","sourcePath":"components/data/ComparisonTable.jsx"},{"name":"StatRow","sourcePath":"components/data/StatRow.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"PromoBanner","sourcePath":"components/feedback/PromoBanner.jsx"},{"name":"Tag","sourcePath":"components/feedback/Tag.jsx"},{"name":"SearchField","sourcePath":"components/forms/SearchField.jsx"},{"name":"TextInput","sourcePath":"components/forms/TextInput.jsx"},{"name":"Footer","sourcePath":"components/navigation/Footer.jsx"},{"name":"PillTabs","sourcePath":"components/navigation/PillTabs.jsx"},{"name":"SegmentedTabs","sourcePath":"components/navigation/SegmentedTabs.jsx"},{"name":"TopNav","sourcePath":"components/navigation/TopNav.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"e09fbc2bde54","components/brand/NodeDivider.jsx":"ab2b85de0e45","components/cards/Card.jsx":"fb03f1a16812","components/cards/MediaCard.jsx":"f6ff5231a492","components/cards/PricingCard.jsx":"ba7a63534745","components/cards/TestimonialCard.jsx":"97b9c2854d77","components/content/CtaBanner.jsx":"c540a1f83c35","components/content/FaqItem.jsx":"ecd8887f1484","components/content/HeroBand.jsx":"ac686ac1c3bd","components/content/LogoWall.jsx":"e989a1b73169","components/data/ComparisonTable.jsx":"31a7e19910ca","components/data/StatRow.jsx":"c67e2443b0dd","components/feedback/Badge.jsx":"3ee0dd2b7e22","components/feedback/PromoBanner.jsx":"e7524bf86dee","components/feedback/Tag.jsx":"7a335c68ba02","components/forms/SearchField.jsx":"6f229d46b6e7","components/forms/TextInput.jsx":"ad8c471e342a","components/navigation/Footer.jsx":"6ab12c1421f2","components/navigation/PillTabs.jsx":"efbca664a7ca","components/navigation/SegmentedTabs.jsx":"67d6cf19ce46","components/navigation/TopNav.jsx":"d4aa67455b3b","ui_kits/website/HomeScreen.jsx":"d78227f643cf","ui_kits/website/IssueScreen.jsx":"b9d7059255ff","ui_kits/website/NewsletterScreen.jsx":"87e787621015","ui_kits/website/PricingScreen.jsx":"a4cbaaa6f9ff","ui_kits/website/data.js":"bbd9ac03c505"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.NodalDesignSystem_2d90b7 = window.NodalDesignSystem_2d90b7 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...a) => a.filter(Boolean).join(' ');
function Button({
  variant = 'primary',
  block = false,
  href,
  disabled = false,
  className,
  children,
  ...rest
}) {
  const cls = cx('nd-btn', 'nd-btn--' + variant, block && 'nd-btn--block', className);
  if (href) return /*#__PURE__*/React.createElement("a", _extends({
    className: cls,
    href: disabled ? undefined : href,
    "aria-disabled": disabled || undefined
  }, rest), children);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: cls,
    disabled: disabled
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/brand/NodeDivider.jsx
try { (() => {
function NodeDivider({
  nodes = 3,
  onDark = false,
  flush = false,
  style
}) {
  const n = Math.max(3, Math.min(5, nodes | 0));
  const parts = [];
  for (let i = 0; i < n; i++) {
    const hollow = i > 0 && i < n - 1;
    parts.push(/*#__PURE__*/React.createElement("span", {
      key: 'n' + i,
      className: 'nd-divider__node' + (hollow ? ' nd-divider__node--hollow' : '')
    }));
    if (i < n - 1) parts.push(/*#__PURE__*/React.createElement("span", {
      key: 'l' + i,
      className: "nd-divider__link"
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    role: "separator",
    className: 'nd-divider' + (onDark ? ' nd-divider--on-dark' : '') + (flush ? ' nd-divider--flush' : ''),
    style: style
  }, parts);
}
Object.assign(__ds_scope, { NodeDivider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/NodeDivider.jsx", error: String((e && e.message) || e) }); }

// components/cards/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...a) => a.filter(Boolean).join(' ');
const TINTS = ['peach', 'rose', 'mint', 'lavender', 'sky', 'yellow', 'yellow-bold', 'cream', 'gray'];
function Card({
  variant = 'base',
  tint,
  elevated = false,
  interactive = false,
  as: Tag = 'div',
  className,
  style,
  children,
  ...rest
}) {
  const t = TINTS.includes(tint) ? tint : null;
  const cls = cx('nd-card', variant === 'feature' && 'nd-card--feature', variant === 'template' && 'nd-card--template', t && 'nd-card--tint', elevated && 'nd-card--elevated', interactive && 'nd-card--interactive', className);
  const s = t ? {
    background: 'var(--card-tint-' + t + ')',
    ...style
  } : style;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls,
    style: s
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/Card.jsx", error: String((e && e.message) || e) }); }

// components/cards/MediaCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function MediaCard({
  aspectRatio = '16 / 9',
  style,
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "nd-media",
    style: {
      aspectRatio,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { MediaCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/MediaCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/TestimonialCard.jsx
try { (() => {
function TestimonialCard({
  quote,
  name,
  role
}) {
  return /*#__PURE__*/React.createElement("figure", {
    className: "nd-quote",
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("blockquote", {
    className: "nd-quote__text"
  }, quote), /*#__PURE__*/React.createElement("figcaption", null, /*#__PURE__*/React.createElement("div", {
    className: "nd-quote__name"
  }, name), role && /*#__PURE__*/React.createElement("div", {
    className: "nd-quote__role"
  }, role)));
}
Object.assign(__ds_scope, { TestimonialCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/TestimonialCard.jsx", error: String((e && e.message) || e) }); }

// components/content/CtaBanner.jsx
try { (() => {
function CtaBanner({
  title,
  text,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "nd-cta"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "nd-cta__title"
  }, title), text && /*#__PURE__*/React.createElement("p", {
    className: "nd-cta__text"
  }, text), children && /*#__PURE__*/React.createElement("div", {
    className: "nd-cta__actions"
  }, children));
}
Object.assign(__ds_scope, { CtaBanner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/CtaBanner.jsx", error: String((e && e.message) || e) }); }

// components/content/FaqItem.jsx
try { (() => {
function FaqItem({
  question,
  children,
  defaultOpen = false
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return /*#__PURE__*/React.createElement("div", {
    className: 'nd-faq' + (open ? ' nd-faq--open' : '')
  }, /*#__PURE__*/React.createElement("button", {
    className: "nd-faq__q",
    "aria-expanded": open,
    onClick: () => setOpen(o => !o)
  }, question, /*#__PURE__*/React.createElement("span", {
    className: "nd-faq__icon",
    "aria-hidden": "true"
  }, "+")), open && /*#__PURE__*/React.createElement("div", {
    className: "nd-faq__a"
  }, children));
}
Object.assign(__ds_scope, { FaqItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/FaqItem.jsx", error: String((e && e.message) || e) }); }

// components/content/HeroBand.jsx
try { (() => {
function HeroBand({
  eyebrow,
  title,
  subtitle,
  actions,
  divider = true,
  children
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "nd-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nd-hero__inner"
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    className: "nd-hero__eyebrow"
  }, eyebrow), /*#__PURE__*/React.createElement("h1", {
    className: "nd-hero__title"
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    className: "nd-hero__subtitle"
  }, subtitle), actions && /*#__PURE__*/React.createElement("div", {
    className: "nd-hero__actions"
  }, actions), divider && /*#__PURE__*/React.createElement("div", {
    className: "nd-hero__divider"
  }, /*#__PURE__*/React.createElement(__ds_scope.NodeDivider, {
    onDark: true,
    flush: true,
    nodes: 5
  })), children && /*#__PURE__*/React.createElement("div", {
    className: "nd-hero__media"
  }, children)));
}
Object.assign(__ds_scope, { HeroBand });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/HeroBand.jsx", error: String((e && e.message) || e) }); }

// components/content/LogoWall.jsx
try { (() => {
function LogoWall({
  items = []
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "nd-logos"
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "nd-logos__item"
  }, it)));
}
Object.assign(__ds_scope, { LogoWall });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/LogoWall.jsx", error: String((e && e.message) || e) }); }

// components/data/ComparisonTable.jsx
try { (() => {
const cell = v => v === true ? /*#__PURE__*/React.createElement("span", {
  className: "nd-table__yes",
  "aria-label": "Included"
}, "\u2713") : v === false ? /*#__PURE__*/React.createElement("span", {
  className: "nd-table__no",
  "aria-label": "Not included"
}, "\u2014") : v;
function ComparisonTable({
  columns = [],
  rows = []
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "nd-table"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, columns[0]), columns.slice(1).map((c, i) => /*#__PURE__*/React.createElement("th", {
    key: i,
    className: "nd-table__val"
  }, c)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => r.section ? /*#__PURE__*/React.createElement("tr", {
    key: i,
    className: "nd-table__section"
  }, /*#__PURE__*/React.createElement("td", {
    colSpan: columns.length
  }, r.section)) : /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, r.label), r.values.map((v, j) => /*#__PURE__*/React.createElement("td", {
    key: j,
    className: "nd-table__val"
  }, cell(v))))))));
}
Object.assign(__ds_scope, { ComparisonTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ComparisonTable.jsx", error: String((e && e.message) || e) }); }

// components/data/StatRow.jsx
try { (() => {
function StatRow({
  stats = []
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "nd-stats"
  }, stats.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "nd-stats__value"
  }, s.value), /*#__PURE__*/React.createElement("div", {
    className: "nd-stats__label"
  }, s.label))));
}
Object.assign(__ds_scope, { StatRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatRow.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
function Badge({
  variant = 'purple',
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: 'nd-badge nd-badge--' + variant
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/cards/PricingCard.jsx
try { (() => {
function PricingCard({
  name,
  price,
  period,
  description,
  features = [],
  ctaLabel = 'Choose plan',
  onCta,
  featured = false,
  badge
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: 'nd-pricing' + (featured ? ' nd-pricing--featured' : '')
  }, /*#__PURE__*/React.createElement("div", {
    className: "nd-pricing__head"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "nd-pricing__name"
  }, name), (badge || featured) && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    variant: "popular"
  }, badge || 'Most popular')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nd-pricing__price"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nd-pricing__amount"
  }, price), period && /*#__PURE__*/React.createElement("span", {
    className: "nd-pricing__period"
  }, period)), description && /*#__PURE__*/React.createElement("p", {
    className: "nd-pricing__desc"
  }, description)), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: featured ? 'primary' : 'secondary',
    block: true,
    onClick: onCta
  }, ctaLabel), features.length > 0 && /*#__PURE__*/React.createElement("ul", {
    className: "nd-pricing__list"
  }, features.map((f, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, f))));
}
Object.assign(__ds_scope, { PricingCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/PricingCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/PromoBanner.jsx
try { (() => {
function PromoBanner({
  children,
  linkLabel,
  href = '#',
  onLink
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "nd-promo"
  }, /*#__PURE__*/React.createElement("span", null, children), linkLabel && /*#__PURE__*/React.createElement("a", {
    href: href,
    onClick: onLink
  }, linkLabel));
}
Object.assign(__ds_scope, { PromoBanner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/PromoBanner.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tag.jsx
try { (() => {
function Tag({
  variant = 'purple',
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: 'nd-tag nd-tag--' + variant
  }, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tag.jsx", error: String((e && e.message) || e) }); }

// components/forms/SearchField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SearchField({
  placeholder = 'Search',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("input", _extends({
    type: "search",
    className: "nd-input nd-search",
    placeholder: placeholder
  }, rest));
}
Object.assign(__ds_scope, { SearchField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SearchField.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextInput.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function TextInput({
  label,
  help,
  error,
  id,
  className,
  ...rest
}) {
  const iid = id || (label ? 'in-' + String(label).toLowerCase().replace(/\W+/g, '-') : undefined);
  return /*#__PURE__*/React.createElement("div", {
    className: 'nd-field' + (className ? ' ' + className : '')
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "nd-field__label",
    htmlFor: iid
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    id: iid,
    className: 'nd-input' + (error ? ' nd-input--error' : ''),
    "aria-invalid": !!error || undefined
  }, rest)), (error || help) && /*#__PURE__*/React.createElement("div", {
    className: 'nd-field__help' + (error ? ' nd-field__help--error' : '')
  }, error || help));
}
Object.assign(__ds_scope, { TextInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextInput.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Footer.jsx
try { (() => {
function Footer({
  brand = 'Nodal',
  tagline,
  columns = [],
  legal
}) {
  return /*#__PURE__*/React.createElement("footer", {
    className: "nd-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nd-footer__inner"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nd-footer__brand"
  }, brand), tagline && /*#__PURE__*/React.createElement("div", {
    className: "nd-footer__tagline"
  }, tagline)), columns.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "nd-footer__heading"
  }, c.title), c.links.map((l, j) => /*#__PURE__*/React.createElement("a", {
    key: j,
    className: "nd-footer__link",
    href: l.href || '#',
    onClick: l.onClick
  }, l.label))))), legal && /*#__PURE__*/React.createElement("div", {
    className: "nd-footer__bottom"
  }, legal));
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Footer.jsx", error: String((e && e.message) || e) }); }

// components/navigation/PillTabs.jsx
try { (() => {
function PillTabs({
  items = [],
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "nd-pilltabs",
    role: "tablist"
  }, items.map(it => {
    const v = typeof it === 'string' ? it : it.value;
    const l = typeof it === 'string' ? it : it.label;
    const on = v === value;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      role: "tab",
      "aria-selected": on,
      className: 'nd-pilltab' + (on ? ' nd-pilltab--active' : ''),
      onClick: () => onChange && onChange(v)
    }, l);
  }));
}
Object.assign(__ds_scope, { PillTabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/PillTabs.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SegmentedTabs.jsx
try { (() => {
function SegmentedTabs({
  items = [],
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "nd-segtabs",
    role: "tablist"
  }, items.map(it => {
    const v = typeof it === 'string' ? it : it.value;
    const l = typeof it === 'string' ? it : it.label;
    const on = v === value;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      role: "tab",
      "aria-selected": on,
      className: 'nd-segtab' + (on ? ' nd-segtab--active' : ''),
      onClick: () => onChange && onChange(v)
    }, l);
  }));
}
Object.assign(__ds_scope, { SegmentedTabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SegmentedTabs.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TopNav.jsx
try { (() => {
function TopNav({
  brand = 'Nodal',
  links = [],
  active,
  onNavigate,
  ctaLabel = 'Subscribe',
  onCta,
  loginLabel = 'Log in',
  onLogin
}) {
  const go = v => e => {
    e.preventDefault();
    onNavigate && onNavigate(v);
  };
  return /*#__PURE__*/React.createElement("header", {
    className: "nd-nav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nd-nav__inner"
  }, /*#__PURE__*/React.createElement("a", {
    className: "nd-nav__brand",
    href: "#",
    onClick: go('home')
  }, brand), /*#__PURE__*/React.createElement("nav", {
    className: "nd-nav__links"
  }, links.map(l => {
    const v = typeof l === 'string' ? l : l.value;
    const t = typeof l === 'string' ? l : l.label;
    return /*#__PURE__*/React.createElement("a", {
      key: v,
      href: "#",
      className: 'nd-nav__link' + (v === active ? ' nd-nav__link--active' : ''),
      onClick: go(v)
    }, t);
  })), /*#__PURE__*/React.createElement("div", {
    className: "nd-nav__right"
  }, loginLabel && /*#__PURE__*/React.createElement("a", {
    className: "nd-nav__login",
    href: "#",
    onClick: e => {
      e.preventDefault();
      onLogin && onLogin();
    }
  }, loginLabel), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    onClick: onCta
  }, ctaLabel), /*#__PURE__*/React.createElement("span", {
    className: "nd-nav__menu"
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "ghost"
  }, "Menu")))));
}
Object.assign(__ds_scope, { TopNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TopNav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/HomeScreen.jsx
try { (() => {
(() => {
  function HomeScreen({
    go
  }) {
    const {
      HeroBand,
      Button,
      MediaCard,
      Card,
      Tag,
      NodeDivider,
      StatRow,
      TestimonialCard,
      CtaBanner,
      TextInput
    } = window.NodalDesignSystem_2d90b7;
    const issues = window.NODAL_ISSUES;
    const [email, setEmail] = React.useState('');
    const [done, setDone] = React.useState(false);
    return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(HeroBand, {
      title: "Data and AI, explained without the hype.",
      subtitle: "A weekly newsletter, carousels and guides on what actually works in applied data and AI.",
      actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        onClick: () => go('pricing')
      }, "Subscribe for free"), /*#__PURE__*/React.createElement(Button, {
        variant: "secondary-on-dark",
        onClick: () => go('newsletter')
      }, "Read the archive"))
    }, /*#__PURE__*/React.createElement(MediaCard, {
      aspectRatio: "16 / 8"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--surface)',
        color: 'var(--steel)'
      },
      className: "nd-body-sm"
    }, "Your chart or issue preview goes here"))), /*#__PURE__*/React.createElement("section", {
      className: "kit-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "kit-head"
    }, /*#__PURE__*/React.createElement("div", {
      className: "nd-micro-uppercase",
      style: {
        color: 'var(--steel)'
      }
    }, "Latest issues"), /*#__PURE__*/React.createElement("h2", {
      className: "nd-heading-2",
      style: {
        margin: '8px 0 0'
      }
    }, "This month in Nodal")), /*#__PURE__*/React.createElement("div", {
      className: "kit-grid3"
    }, issues.slice(0, 3).map(i => /*#__PURE__*/React.createElement(Card, {
      key: i.n,
      tint: i.tint,
      interactive: true,
      onClick: () => go('issue', i.n),
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        minHeight: 260
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Tag, {
      variant: i.tagV
    }, i.tag), /*#__PURE__*/React.createElement("span", {
      className: "nd-caption",
      style: {
        color: 'var(--slate)'
      }
    }, "Issue ", i.n)), /*#__PURE__*/React.createElement("h3", {
      className: "nd-heading-4",
      style: {
        margin: 0
      }
    }, i.title), /*#__PURE__*/React.createElement("p", {
      className: "nd-body-sm",
      style: {
        margin: 0,
        color: 'var(--charcoal)'
      }
    }, i.excerpt), /*#__PURE__*/React.createElement("div", {
      className: "nd-caption",
      style: {
        marginTop: 'auto',
        color: 'var(--slate)'
      }
    }, i.date, " \xB7 ", i.mins, " min read")))), /*#__PURE__*/React.createElement(NodeDivider, {
      nodes: 5,
      style: {
        margin: '64px 0'
      }
    }), /*#__PURE__*/React.createElement(Card, {
      tint: "yellow-bold",
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)',
        gap: 32,
        alignItems: 'center'
      },
      className: "kit-split"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "nd-micro-uppercase",
      style: {
        color: 'var(--brand-brown)'
      }
    }, "Guide"), /*#__PURE__*/React.createElement("h2", {
      className: "nd-heading-2",
      style: {
        margin: '8px 0 12px'
      }
    }, "The LLM evaluation field guide"), /*#__PURE__*/React.createElement("p", {
      className: "nd-body-md",
      style: {
        margin: 0
      }
    }, "Twelve pages on building an eval set you can trust, with templates for rubrics and a worked example.")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "dark",
      onClick: () => go('issue', 42)
    }, "Read the guide"))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 64
      }
    }, /*#__PURE__*/React.createElement(StatRow, {
      stats: [{
        value: '142',
        label: 'Issues published'
      }, {
        value: '38',
        label: 'Open datasets'
      }, {
        value: '6 min',
        label: 'Average read'
      }, {
        value: 'Tuesday',
        label: 'Every week'
      }]
    })), /*#__PURE__*/React.createElement("div", {
      className: "kit-grid3",
      style: {
        marginTop: 64
      }
    }, /*#__PURE__*/React.createElement(TestimonialCard, {
      quote: "The only newsletter where I read the methodology section.",
      name: "Camille R.",
      role: "Analytics lead"
    }), /*#__PURE__*/React.createElement(TestimonialCard, {
      quote: "Sourced, short, and the notebooks actually run.",
      name: "Yanis B.",
      role: "Data engineer"
    }), /*#__PURE__*/React.createElement(TestimonialCard, {
      quote: "I use the carousels to explain evals to my team.",
      name: "In\xE8s M.",
      role: "Product manager"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 64
      }
    }, /*#__PURE__*/React.createElement(CtaBanner, {
      title: done ? 'You are on the list.' : 'Get the next issue',
      text: done ? 'Check your inbox to confirm. The next issue lands on Tuesday.' : 'One email every Tuesday. Unsubscribe in one click.'
    }, !done && /*#__PURE__*/React.createElement("form", {
      onSubmit: e => {
        e.preventDefault();
        if (email.includes('@')) setDone(true);
      },
      style: {
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 300
      }
    }, /*#__PURE__*/React.createElement(TextInput, {
      type: "email",
      placeholder: "you@example.com",
      value: email,
      onChange: e => setEmail(e.target.value),
      "aria-label": "Email"
    })), /*#__PURE__*/React.createElement(Button, {
      type: "submit",
      style: {
        height: 44
      }
    }, "Subscribe"))))));
  }
  window.HomeScreen = HomeScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/IssueScreen.jsx
try { (() => {
(() => {
  function IssueScreen({
    go,
    n
  }) {
    const {
      Tag,
      NodeDivider,
      Button,
      Card,
      Badge
    } = window.NodalDesignSystem_2d90b7;
    const i = window.NODAL_ISSUES.find(x => x.n === n) || window.NODAL_ISSUES[0];
    return /*#__PURE__*/React.createElement("main", {
      style: {
        maxWidth: 720,
        margin: '0 auto',
        padding: '64px 32px 96px'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "link",
      onClick: () => go('newsletter')
    }, "\u2190 All issues"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        marginTop: 32
      }
    }, /*#__PURE__*/React.createElement(Tag, {
      variant: i.tagV
    }, i.tag), /*#__PURE__*/React.createElement("span", {
      className: "nd-caption",
      style: {
        color: 'var(--steel)'
      }
    }, "Issue ", i.n, " \xB7 ", i.date, " \xB7 ", i.mins, " min read")), /*#__PURE__*/React.createElement("h1", {
      className: "nd-heading-1",
      style: {
        margin: '16px 0'
      }
    }, i.title), /*#__PURE__*/React.createElement("p", {
      className: "nd-subtitle",
      style: {
        margin: 0,
        color: 'var(--slate)'
      }
    }, i.excerpt), /*#__PURE__*/React.createElement(NodeDivider, null), /*#__PURE__*/React.createElement("div", {
      className: "nd-body-md",
      style: {
        color: 'var(--ink)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0
      }
    }, "Most teams start evaluating a model by reading twenty outputs and deciding they look fine. That works until the prompt changes, or the model does, and nobody can say whether things got better."), /*#__PURE__*/React.createElement("h2", {
      className: "nd-heading-3",
      style: {
        margin: '16px 0 0'
      }
    }, "Start with fifty real questions"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0
      }
    }, "Pull them from logs, not from imagination. Write the answer you would accept for each one, and note why. That note becomes your rubric."), /*#__PURE__*/React.createElement(Card, {
      tint: "sky"
    }, /*#__PURE__*/React.createElement("div", {
      className: "nd-heading-5",
      style: {
        marginBottom: 6
      }
    }, "Rule of thumb"), /*#__PURE__*/React.createElement("div", {
      className: "nd-body-sm"
    }, "If two people on your team disagree on a grade more than one time in five, the rubric is the problem, not the model.")), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0
      }
    }, "Read the ", /*#__PURE__*/React.createElement("a", {
      href: "#",
      style: {
        color: 'var(--link-blue)'
      }
    }, "full methodology"), " in the members\u2019 notebook.")), /*#__PURE__*/React.createElement(NodeDivider, {
      style: {
        margin: '48px 0'
      }
    }), /*#__PURE__*/React.createElement(Card, {
      variant: "feature",
      style: {
        display: 'flex',
        gap: 24,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "nd-heading-5"
    }, "Get the notebook"), /*#__PURE__*/React.createElement(Badge, null, "Members")), /*#__PURE__*/React.createElement("div", {
      className: "nd-body-sm",
      style: {
        color: 'var(--slate)',
        marginTop: 4
      }
    }, "Rubric template, grading script and the 50-question set.")), /*#__PURE__*/React.createElement(Button, {
      onClick: () => go('pricing')
    }, "Become a member")));
  }
  window.IssueScreen = IssueScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/IssueScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/NewsletterScreen.jsx
try { (() => {
(() => {
  function NewsletterScreen({
    go
  }) {
    const {
      PillTabs,
      SearchField,
      Card,
      Tag,
      NodeDivider,
      Button
    } = window.NodalDesignSystem_2d90b7;
    const [tab, setTab] = React.useState('All');
    const [q, setQ] = React.useState('');
    const list = window.NODAL_ISSUES.filter(i => (tab === 'All' || i.tag === tab) && i.title.toLowerCase().includes(q.toLowerCase()));
    return /*#__PURE__*/React.createElement("main", {
      className: "kit-section",
      style: {
        paddingTop: 64
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "nd-micro-uppercase",
      style: {
        color: 'var(--steel)'
      }
    }, "Newsletter"), /*#__PURE__*/React.createElement("h1", {
      className: "nd-heading-1",
      style: {
        margin: '8px 0 12px'
      }
    }, "The archive"), /*#__PURE__*/React.createElement("p", {
      className: "nd-subtitle",
      style: {
        margin: 0,
        color: 'var(--slate)',
        maxWidth: 620
      }
    }, "Every issue since the first one, searchable. Members get the datasets and notebooks."), /*#__PURE__*/React.createElement(NodeDivider, null), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginBottom: 32
      }
    }, /*#__PURE__*/React.createElement(PillTabs, {
      items: ['All', 'AI', 'Tutorial', 'Dataset'],
      value: tab,
      onChange: setTab
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 280
      }
    }, /*#__PURE__*/React.createElement(SearchField, {
      placeholder: "Search issues",
      value: q,
      onChange: e => setQ(e.target.value)
    }))), /*#__PURE__*/React.createElement("div", {
      className: "kit-grid3"
    }, list.map(i => /*#__PURE__*/React.createElement(Card, {
      key: i.n,
      variant: "template",
      interactive: true,
      onClick: () => go('issue', i.n),
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        aspectRatio: '4 / 3',
        borderRadius: 8,
        background: 'var(--card-tint-' + i.tint + ')',
        display: 'grid',
        placeItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "nd-heading-2",
      style: {
        color: 'var(--charcoal)'
      }
    }, i.n)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Tag, {
      variant: i.tagV
    }, i.tag), /*#__PURE__*/React.createElement("span", {
      className: "nd-caption",
      style: {
        color: 'var(--steel)'
      }
    }, i.date)), /*#__PURE__*/React.createElement("h3", {
      className: "nd-heading-5",
      style: {
        margin: 0
      }
    }, i.title))), list.length === 0 && /*#__PURE__*/React.createElement("p", {
      className: "nd-body-md",
      style: {
        color: 'var(--steel)'
      }
    }, "No issues match \u201C", q, "\u201D.")));
  }
  window.NewsletterScreen = NewsletterScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/NewsletterScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/PricingScreen.jsx
try { (() => {
(() => {
  function PricingScreen({
    go
  }) {
    const {
      SegmentedTabs,
      PricingCard,
      ComparisonTable,
      FaqItem,
      LogoWall,
      NodeDivider
    } = window.NodalDesignSystem_2d90b7;
    const [period, setPeriod] = React.useState('Monthly');
    const y = period === 'Yearly';
    return /*#__PURE__*/React.createElement("main", {
      className: "kit-section",
      style: {
        paddingTop: 64
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        maxWidth: 640,
        margin: '0 auto'
      }
    }, /*#__PURE__*/React.createElement("h1", {
      className: "nd-heading-1",
      style: {
        margin: '0 0 12px'
      }
    }, "Read free. Join for the data."), /*#__PURE__*/React.createElement("p", {
      className: "nd-subtitle",
      style: {
        margin: 0,
        color: 'var(--slate)'
      }
    }, "The weekly issue stays free. Membership adds the archive, datasets and notebooks.")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        margin: '32px 0'
      }
    }, /*#__PURE__*/React.createElement(SegmentedTabs, {
      items: ['Monthly', 'Yearly'],
      value: period,
      onChange: setPeriod
    })), /*#__PURE__*/React.createElement("div", {
      className: "kit-grid3",
      style: {
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement(PricingCard, {
      name: "Free",
      price: "\u20AC0",
      period: "/ month",
      description: "The weekly issue in your inbox.",
      ctaLabel: "Subscribe",
      features: ['Weekly newsletter', 'Last 4 issues', 'Carousel downloads']
    }), /*#__PURE__*/React.createElement(PricingCard, {
      featured: true,
      name: "Member",
      price: y ? '€80' : '€8',
      period: y ? '/ year' : '/ month',
      description: "For people who want to reuse the work.",
      ctaLabel: "Become a member",
      features: ['Everything in Free', 'Full archive', 'Datasets and notebooks', 'Monthly Q&A']
    }), /*#__PURE__*/React.createElement(PricingCard, {
      name: "Team",
      price: y ? '€400' : '€40',
      period: y ? '/ year' : '/ month',
      description: "Up to 10 seats, one invoice.",
      ctaLabel: "Contact",
      features: ['Everything in Member', '10 seats', 'Internal workshop']
    })), /*#__PURE__*/React.createElement(NodeDivider, {
      style: {
        margin: '64px 0'
      }
    }), /*#__PURE__*/React.createElement("h2", {
      className: "nd-heading-3",
      style: {
        margin: '0 0 24px'
      }
    }, "Compare plans"), /*#__PURE__*/React.createElement(ComparisonTable, {
      columns: ['Feature', 'Free', 'Member', 'Team'],
      rows: [{
        section: 'Reading'
      }, {
        label: 'Weekly issue',
        values: [true, true, true]
      }, {
        label: 'Archive',
        values: ['Last 4', 'All', 'All']
      }, {
        section: 'Resources'
      }, {
        label: 'Datasets',
        values: [false, true, true]
      }, {
        label: 'Notebooks',
        values: [false, true, true]
      }, {
        label: 'Workshop',
        values: [false, false, '1 / year']
      }]
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 48
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "nd-micro-uppercase",
      style: {
        color: 'var(--steel)',
        textAlign: 'center'
      }
    }, "Tools covered"), /*#__PURE__*/React.createElement(LogoWall, {
      items: ['Python', 'SQL', 'DuckDB', 'dbt', 'Polars']
    })), /*#__PURE__*/React.createElement("h2", {
      className: "nd-heading-3",
      style: {
        margin: '48px 0 16px'
      }
    }, "Questions"), /*#__PURE__*/React.createElement("div", {
      style: {
        borderTop: '1px solid var(--hairline)'
      }
    }, /*#__PURE__*/React.createElement(FaqItem, {
      question: "When does the newsletter go out?",
      defaultOpen: true
    }, "Every Tuesday at 8:00 Paris time."), /*#__PURE__*/React.createElement(FaqItem, {
      question: "Can I cancel anytime?"
    }, "Yes. Membership stops at the end of the current period."), /*#__PURE__*/React.createElement(FaqItem, {
      question: "Can I reuse the datasets?"
    }, "Yes, under the licence listed in each dataset\u2019s readme.")));
  }
  window.PricingScreen = PricingScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/PricingScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/data.js
try { (() => {
window.NODAL_ISSUES = [{
  n: 42,
  title: 'A field guide to evaluating LLM outputs',
  tag: 'AI',
  tagV: 'purple',
  date: '21 Oct 2026',
  mins: 7,
  excerpt: 'Reference answers, rubric grading and pairwise judges: when each one holds up, and when it quietly lies.',
  tint: 'lavender'
}, {
  n: 41,
  title: 'DuckDB for the analyst who lives in spreadsheets',
  tag: 'Tutorial',
  tagV: 'orange',
  date: '14 Oct 2026',
  mins: 6,
  excerpt: 'Query a folder of CSVs in place, join them, and export a clean table without a database server.',
  tint: 'peach'
}, {
  n: 40,
  title: 'Open data on French energy prices, cleaned',
  tag: 'Dataset',
  tagV: 'green',
  date: '7 Oct 2026',
  mins: 4,
  excerpt: 'Ten years of monthly regulated tariffs in one tidy file, with the notebook that built it.',
  tint: 'mint'
}, {
  n: 39,
  title: 'Retrieval is a search problem first',
  tag: 'AI',
  tagV: 'purple',
  date: '30 Sep 2026',
  mins: 8,
  excerpt: 'Before tuning embeddings, measure what plain keyword search already gets right.',
  tint: 'sky'
}, {
  n: 38,
  title: 'Charts that survive a phone screen',
  tag: 'Tutorial',
  tagV: 'orange',
  date: '23 Sep 2026',
  mins: 5,
  excerpt: 'Five rules for carousel-ready charts: one message, direct labels, no legends.',
  tint: 'rose'
}, {
  n: 37,
  title: 'A year of public sector datasets, ranked',
  tag: 'Dataset',
  tagV: 'green',
  date: '16 Sep 2026',
  mins: 6,
  excerpt: 'Which portals publish usable files, which publish PDFs, and how to tell in two minutes.',
  tint: 'cream'
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.NodeDivider = __ds_scope.NodeDivider;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.MediaCard = __ds_scope.MediaCard;

__ds_ns.PricingCard = __ds_scope.PricingCard;

__ds_ns.TestimonialCard = __ds_scope.TestimonialCard;

__ds_ns.CtaBanner = __ds_scope.CtaBanner;

__ds_ns.FaqItem = __ds_scope.FaqItem;

__ds_ns.HeroBand = __ds_scope.HeroBand;

__ds_ns.LogoWall = __ds_scope.LogoWall;

__ds_ns.ComparisonTable = __ds_scope.ComparisonTable;

__ds_ns.StatRow = __ds_scope.StatRow;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.PromoBanner = __ds_scope.PromoBanner;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.SearchField = __ds_scope.SearchField;

__ds_ns.TextInput = __ds_scope.TextInput;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.PillTabs = __ds_scope.PillTabs;

__ds_ns.SegmentedTabs = __ds_scope.SegmentedTabs;

__ds_ns.TopNav = __ds_scope.TopNav;

})();
