(function() {
  console.log("Raid.Ninja Route extension running...");

  let rnRoutePos = 0;

  function rnRouteCreateInitialClone() {
    const el = document.getElementById('startLocation').cloneNode(true);
    el.id = 'rnRouteLocation';
    el.removeAttribute('onchange');
    return el;
  }

  function rnRouteCreateClone(itemToClone, index, locked, startingValue) {
    const parent = document.createElement('span');
    parent.classList.add('rnRouteLocation');

    const el = itemToClone.cloneNode(true);
    el.id = el.id + index;
    el.onchange = rnRouteUpdateSelection;

    if (startingValue) {
      el.selectedIndex = [...el.options].findIndex((opt) => opt.value === startingValue);
      if (locked) {
        el.disabled = true;
      }
    }

    parent.appendChild(el);
    return parent;
  }

  function rnRouteCreateNavigator(text, handler) {
    const el = document.createElement('button');
    el.innerText = text;
    el.onclick = handler;
    return el;
  }

  function rnRouteClickNext() {
    rnRoutePos = rnRoutePos + 1;
    if (rnRoutePos > 3) {
      rnRoutePos = 3;
    }
    rnRouteUpdateSelection();
  }

  function rnRouteClickPrev() {
    rnRoutePos = rnRoutePos - 1;
    if (rnRoutePos < 0) {
      rnRoutePos = 0;
    }
    rnRouteUpdateSelection();
  }

  function rnRouteUpdateSelection() {
    const all = document.getElementsByClassName('rnRouteLocation');
    let i = 0;
    [...all].forEach((el) => {
      if ((rnRoutePos === i) || ((rnRoutePos + 1) === i)) {
        el.classList.add('rnRouteLocationSelected');

        if (rnRoutePos === i) {
          const start = document.getElementById("startLocation");
          start.selectedIndex = el.childNodes[0].selectedIndex;
          start.dispatchEvent(new Event('change', { bubbles: true }));
        } else if ((rnRoutePos + 1) === i) {
          const end = document.getElementById("endLocation");
          end.selectedIndex = el.childNodes[0].selectedIndex;
          end.dispatchEvent(new Event('change', { bubbles: true }));
        }
      } else {
        el.classList.remove('rnRouteLocationSelected');
      }
      i++;
    });
  }

  const queryParams = new URLSearchParams(location.search.slice(1));
  const rnRouteLocation = rnRouteCreateInitialClone();

  const rnRouteContainer = document.createElement('div');
  rnRouteContainer.classList.add('rnRoute-header');

  rnRouteContainer.appendChild(rnRouteCreateNavigator('<', rnRouteClickPrev));
  rnRouteContainer.appendChild(rnRouteCreateClone(rnRouteLocation, 0, true, 'ENTRANCE'));
  rnRouteContainer.appendChild(rnRouteCreateClone(rnRouteLocation, 1, false, queryParams.get('loc1')));
  rnRouteContainer.appendChild(rnRouteCreateClone(rnRouteLocation, 2, false, queryParams.get('loc2')));
  rnRouteContainer.appendChild(rnRouteCreateClone(rnRouteLocation, 3, false, queryParams.get('loc3')));
  rnRouteContainer.appendChild(rnRouteCreateClone(rnRouteLocation, 4, true, "THRONE_ROOM"));
  rnRouteContainer.appendChild(rnRouteCreateNavigator('>', rnRouteClickNext));

  document.getElementsByClassName('inner-content')[0].classList.add('rnRoute-header-adjust');
  document.body.insertBefore(rnRouteContainer, document.body.childNodes[0]);

  rnRouteUpdateSelection();
})();