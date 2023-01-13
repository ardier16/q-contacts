import { createPopper } from '@popperjs/core'

import '@/styles/content.scss'
import { StorageItemKey } from '@/constants/extension'
import { MessageProvider } from '@/services/message-provider'
import { Contact } from '@/types/contacts'

const ACTIVE_ADDRESS_CLASS = 'q-address__address--active'
const messageProvider = new MessageProvider()
messageProvider.setExtensionId(chrome.runtime.id)

let contacts: Contact[] = []

async function checkAddresses () {
  if (!contacts?.length) return

  const links = [...document.querySelectorAll<HTMLAnchorElement>(`a[href*="0x"]:not(.${ACTIVE_ADDRESS_CLASS})`)]
  links.forEach(link => {
    const addressItem = contacts.find(item => link.href.includes(item.address))
    if (!addressItem) return

    link.classList.add(ACTIVE_ADDRESS_CLASS)
    const icon = findLinkIcon(link)
    if (!icon) return

    icon.style.position = 'relative'
    addActiveMarker(icon)
    initIconTooltip(icon, addressItem.name)
  })
}

function findLinkIcon (link: HTMLAnchorElement) {
  const parent = link.parentElement
  const wrappers = [
    parent?.firstChild as HTMLElement,
    parent?.parentElement?.firstChild as HTMLElement,
  ]

  return wrappers.find(item => item?.querySelector('svg'))
}

function addActiveMarker (icon: HTMLElement) {
  const marker = document.createElement('div')
  marker.className = 'q-address__marker'
  icon.appendChild(marker)
}

function initIconTooltip (icon: HTMLElement, name: string) {
  const tooltip = document.createElement('span')
  tooltip.className = 'q-address__tooltip'

  tooltip.innerText = name
  icon.appendChild(tooltip)

  const popperInstance = createPopper(icon, tooltip, {
    placement: 'top',
    strategy: 'fixed',
    modifiers: [
      {
        name: 'offset',
        options: { offset: [0, 10] },
      },
    ],
  })

  icon.addEventListener('mouseenter', () => {
    tooltip.setAttribute('data-show', '')
    popperInstance.update()
  })

  icon.addEventListener('mouseleave', () => {
    tooltip.removeAttribute('data-show')
  })
}

async function loadContacts () {
  contacts = await messageProvider.getStorageItem(StorageItemKey.contacts) as Contact[]
}

loadContacts()
chrome.storage.onChanged.addListener(loadContacts)
setInterval(checkAddresses, 1000)
