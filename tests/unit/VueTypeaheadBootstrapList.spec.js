import { mount } from '@vue/test-utils'
import VueTypeaheadBootstrapList from '@/components/VueTypeaheadBootstrapList.vue'
import VueTypeaheadBootstrapListItem from '@/components/VueTypeaheadBootstrapListItem.vue'

describe('VueBootstrapTypeaheadList', () => {
  let wrapper

  const demoData = [
    {
      id: 0,
      data: 'Canada',
      text: 'Canada'
    },
    {
      id: 1,
      data: 'USA',
      text: 'USA'
    },
    {
      id: 2,
      data: 'Mexico',
      text: 'Mexico'
    },
    {
      id: 3,
      data: 'Canadiana',
      text: 'Canadiana'
    }
  ]

  beforeEach(() => {
    wrapper = mount(VueTypeaheadBootstrapList, {
      propsData: {
        data: demoData,
        vbtUniqueId: 123456789
      }
    })
  })

  it('Mounts and renders a list-group div', () => {
    expect(wrapper.element.tagName.toLowerCase()).toBe('div')
    expect(wrapper.classes()).toContain('list-group')
  })

  it("Orders the results with text matches early in the hit's text first, not alphabetically", () => {
    const data = [
      {
        id: 0,
        data: 'all quiet on the western front',
        text: 'all quiet on the western front'
      },
      {
        id: 1,
        data: 'west side story',
        text: 'west side story'
      },
      {
        id: 2,
        data: 'western nevada',
        text: 'western nevada'
      }
    ]

    wrapper = mount(VueTypeaheadBootstrapList, {
      propsData: {
        data: data,
        vbtUniqueId: 123456789
      }
    })

    expect(wrapper.vm.matchedItems.length).toBe(0)
    wrapper.setProps({
      query: 'west'
    })
    expect(wrapper.vm.matchedItems.length).toBe(3)
    let expectedOrder = ['west side story', 'western nevada', 'all quiet on the western front']
    expect(wrapper.vm.matchedItems.map(item => item.text)).toEqual(expectedOrder)
  })

  it("Orders the results with text matches early in the hit's text first, not alphabetically (with accents)", () => {
    const data = [
      {
        id: 0,
        data: 'le destin d\'amélie poulain',
        text: 'le destin d\'amélie poulain'
      },
      {
        id: 1,
        data: 'amélie poulain',
        text: 'amélie poulain'
      }
    ]

    wrapper = mount(VueTypeaheadBootstrapList, {
      propsData: {
        data: data,
        vbtUniqueId: 123456789
      }
    })

    expect(wrapper.vm.matchedItems.length).toBe(0)
    wrapper.setProps({
      query: 'amélie'
    })
    expect(wrapper.vm.matchedItems.length).toBe(2)
    let expectedOrder = ['amélie poulain', 'le destin d\'amélie poulain']
    expect(wrapper.vm.matchedItems.map(item => item.text)).toEqual(expectedOrder)
  })

  it('Matches items when there is a query', async () => {
    expect(wrapper.vm.matchedItems.length).toBe(0)
    wrapper.setProps({
      query: 'Can'
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.matchedItems.length).toBe(2)
    expect(wrapper.findAllComponents(VueTypeaheadBootstrapListItem).length).toBe(2)
    wrapper.setProps({
      query: 'Canada'
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.matchedItems.length).toBe(1)
    expect(wrapper.findAllComponents(VueTypeaheadBootstrapListItem).length).toBe(1)
  })

  it('Matches no items when there is no query', () => {
    expect(wrapper.vm.matchedItems.length).toBe(0)
    wrapper.setProps({
      query: ''
    })
    expect(wrapper.vm.matchedItems.length).toBe(0)
    expect(wrapper.findAllComponents(VueTypeaheadBootstrapListItem).length).toBe(0)
  })

  it('Limits the number of matches with maxMatches', () => {
    wrapper.setProps({
      query: 'can'
    })
    expect(wrapper.vm.matchedItems.length).toBe(2)
    wrapper.setProps({
      maxMatches: 1
    })
    expect(wrapper.vm.matchedItems.length).toBe(1)
  })

  it('Uses minMatchingChars to filter the number of matches', async () => {
    wrapper.setProps({
      query: 'c',
      minMatchingChars: 1
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents(VueTypeaheadBootstrapListItem).length).toBe(3)
  })

  it('Highlights text matches properly by default', async () => {
    wrapper.setProps({
      query: 'Cana'
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(VueTypeaheadBootstrapListItem).vm.htmlText).toBe(`<span class='vbt-matched-text'>Cana</span>da`)
  })

  it('Highlights text matches correctly when the data contains accents and the query does not', async () => {
    wrapper.setProps({
      data: [
        {
          id: 0,
          data: 'amélie',
          text: 'amélie'
        }
      ],
      query: 'ame'
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(VueTypeaheadBootstrapListItem).vm.htmlText).toBe(`<span class='vbt-matched-text'>amé</span>lie`)
  })

  it('Highlights text matches correctly when the query contains accents and the data does not', async () => {
    wrapper.setProps({
      data: [
        {
          id: 0,
          data: 'amelie',
          text: 'amelie'
        }
      ],
      query: 'amé'
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(VueTypeaheadBootstrapListItem).vm.htmlText).toBe(`<span class='vbt-matched-text'>ame</span>lie`)
  })

  describe('selecting items with the keyboard', () => {
    beforeEach(() => {
      wrapper.setProps({
        data: [
          {
            id: 0,
            data: 'Canada',
            text: 'Canada'
          },
          {
            id: 1,
            data: 'Canada1',
            text: 'Canada1'
          },
          {
            id: 2,
            data: 'Canada2',
            text: 'Canada2'
          }
        ],
        query: 'Cana'
      })
    })

    describe('using the down arrow', () => {
      it('cycles through all options', () => {
        wrapper.vm.selectNextListItem()
        expect(wrapper.vm.activeListItem).toBe(0)
        wrapper.vm.selectNextListItem()
        expect(wrapper.vm.activeListItem).toBe(1)
        wrapper.vm.selectNextListItem()
        expect(wrapper.vm.activeListItem).toBe(2)
      })
      it('returns the first item when nothing is disabled', () => {
        wrapper.vm.selectNextListItem()
        expect(wrapper.vm.activeListItem).toBe(0)
      })
      it('returns the second item when the first is disabled', () => {
        wrapper.setProps({ disabledValues: ['Canada'] })
        wrapper.vm.selectNextListItem()
        expect(wrapper.vm.activeListItem).toBe(1)
      })
      it('returns the third item when the first and second are disabled', () => {
        wrapper.setProps({ disabledValues: ['Canada', 'Canada1'] })
        wrapper.vm.selectNextListItem()
        expect(wrapper.vm.activeListItem).toBe(2)
      })
      it('returns -1 when everything is disabled', () => {
        wrapper.setProps({ disabledValues: ['Canada', 'Canada1', 'Canada2'] })
        wrapper.vm.selectNextListItem()
        expect(wrapper.vm.activeListItem).toBe(-1)
        wrapper.vm.selectNextListItem()
        expect(wrapper.vm.activeListItem).toBe(-1)
      })
      it('wraps back to the beginning from the end', () => {
        wrapper.vm.activeListItem = 1
        wrapper.vm.selectNextListItem()
        expect(wrapper.vm.activeListItem).toBe(2)
        wrapper.vm.selectNextListItem()
        expect(wrapper.vm.activeListItem).toBe(0)
      })
      it('wrapping accounts for disabled items', () => {
        wrapper.setProps({ disabledValues: ['Canada'] })
        wrapper.vm.activeListItem = 2
        wrapper.vm.selectNextListItem()
        expect(wrapper.vm.activeListItem).toBe(1)
      })
    })

    describe('using the up arrow', () => {
      it('returns the last item when nothing is disabled', () => {
        wrapper.vm.selectPreviousListItem()
        expect(wrapper.vm.activeListItem).toBe(2)
      })
      it('returns the second item when the last is disabled', () => {
        wrapper.setProps({ disabledValues: ['Canada2'] })
        wrapper.vm.selectPreviousListItem()
        expect(wrapper.vm.activeListItem).toBe(1)
      })
      it('returns the second item when the third and fourth are disabled', () => {
        wrapper.setProps({ disabledValues: ['Canada3', 'Canada2'] })
        wrapper.vm.selectPreviousListItem()
        expect(wrapper.vm.activeListItem).toBe(1)
      })
      it('returns -1 when everything is disabled', () => {
        wrapper.setProps({ disabledValues: ['Canada', 'Canada1', 'Canada2', 'Canada3'] })
        wrapper.vm.selectPreviousListItem()
        expect(wrapper.vm.activeListItem).toBe(-1)
        wrapper.vm.selectPreviousListItem()
        expect(wrapper.vm.activeListItem).toBe(-1)
      })
      it('cycles through all options', () => {
        wrapper.vm.selectPreviousListItem()
        expect(wrapper.vm.activeListItem).toBe(2)
        wrapper.vm.selectPreviousListItem()
        expect(wrapper.vm.activeListItem).toBe(1)
        wrapper.vm.selectPreviousListItem()
        expect(wrapper.vm.activeListItem).toBe(0)
      })
      it('wraps back to the end from the beginning', () => {
        wrapper.vm.activeListItem = 1
        wrapper.vm.selectPreviousListItem()
        expect(wrapper.vm.activeListItem).toBe(0)
        wrapper.vm.selectPreviousListItem()
        expect(wrapper.vm.activeListItem).toBe(2)
      })
      it('wrapping accounts for disabled items', () => {
        wrapper.setProps({ disabledValues: ['Canada2'] })
        wrapper.vm.activeListItem = 0
        wrapper.vm.selectPreviousListItem()
        expect(wrapper.vm.activeListItem).toBe(1)
      })
    })
  })

  describe('Selecting on Enter Key', () => {
    beforeEach(() => {
      wrapper.setProps({
        data: [
          {
            id: 0,
            data: 'Canada',
            text: 'Canada'
          },
          {
            id: 1,
            data: 'Canada1',
            text: 'Canada1'
          },
          {
            id: 2,
            data: 'Canada2',
            text: 'Canada2'
          }
        ]
      })
    })

    it('does not return a hit with no matches', async () => {
      wrapper.setProps({
        query: ';lskdj'
      })
      await wrapper.vm.$nextTick()
      wrapper.vm.handleParentInputKeyup({keyCode: 13}) // simulate enter key
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('hit')).toBeFalsy()
    })

    describe('with some matches', () => {
      beforeEach(() => {
        wrapper.setProps({
          query: 'Cana'
        })
      })
      it('returns the selected item when one is selected', async () => {
        wrapper.vm.selectNextListItem()
        wrapper.vm.selectNextListItem()
        await wrapper.vm.$nextTick()
        wrapper.vm.handleParentInputKeyup({keyCode: 13}) // simulate enter key
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted().hit).toBeTruthy()
        expect(wrapper.emitted().hit[0][0].id).toBe(1)
      })

      it('returns the first item when no item is selected', async () => {
        await wrapper.vm.$nextTick()
        wrapper.vm.handleParentInputKeyup({keyCode: 13}) // simulate enter key
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted().hit).toBeTruthy()
        expect(wrapper.emitted().hit[0][0].id).toBe(0)
      })

      it('returns the first enabled item when no item is selected', async () => {
        wrapper.setProps({
          disabledValues: ['Canada']
        })
        wrapper.vm.handleParentInputKeyup({keyCode: 13}) // simulate enter key
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted().hit).toBeTruthy()
        expect(wrapper.emitted().hit[0][0].id).toBe(1)
      })
    })

    it('returns the only non-disabled item as a hit with only one enabled match', async () => {
      wrapper.setProps({
        disabledValues: ['Canada', 'Canada2'],
        query: 'Cana'
      })
      await wrapper.vm.$nextTick()
      wrapper.vm.handleParentInputKeyup({keyCode: 13}) // simulate enter key
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted().hit).toBeTruthy()
      expect(wrapper.emitted().hit[0][0].id).toBe(1)
    })

    it('does not return a hit with only disabled matches', async () => {
      wrapper.setProps({
        disabledValues: ['Canada', 'Canada1', 'Canada2'],
        query: 'Cana'
      })
      await wrapper.vm.$nextTick()
      wrapper.vm.handleParentInputKeyup({keyCode: 13}) // simulate enter key
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('hit')).toBeFalsy()
    })
  })

  it('Highlights text matches properly with highlightClass prop', async () => {
    wrapper.setProps({
      query: 'Canada',
      highlightClass: 'myStyle'
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(VueTypeaheadBootstrapListItem).vm.htmlText).toBe(`<span class='myStyle'>Canada</span>`)
  })
})
