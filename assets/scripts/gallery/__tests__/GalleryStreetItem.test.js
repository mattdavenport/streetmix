/* eslint-env jest */
import React from 'react'
import { fireEvent } from '@testing-library/react'
import { renderWithReduxAndIntl } from '../../../../test/helpers/render'
import MOCK_STREET from '../../../../test/fixtures/street.json'
import GalleryStreetItem from '../GalleryStreetItem'

// Mock dependencies
jest.mock('../../streets/thumbnail', () => ({
  drawStreetThumbnail: jest.fn()
}))
jest.mock('../../app/page_url', () => ({
  getStreetUrl: jest.fn()
}))

describe('GalleryStreetItem', () => {
  it('renders', () => {
    // This uses jsdom + canvas packages under the hood to render canvas element
    const wrapper = renderWithReduxAndIntl(
      <GalleryStreetItem street={MOCK_STREET} />
    )
    expect(wrapper.asFragment()).toMatchSnapshot()
  })

  it('does not display street owner when not provided', () => {
    const wrapper = renderWithReduxAndIntl(
      <GalleryStreetItem street={MOCK_STREET} showStreetOwner={false} />
    )

    expect(wrapper.queryByText('creatorFoo')).not.toBeInTheDocument()
  })

  it('handles select', () => {
    const doSelect = jest.fn()
    const wrapper = renderWithReduxAndIntl(
      <GalleryStreetItem street={MOCK_STREET} doSelect={doSelect} />
    )

    fireEvent.click(wrapper.getByText(MOCK_STREET.name))
    expect(doSelect).toBeCalled()
  })

  it('handles delete when confirmed', () => {
    const doDelete = jest.fn()
    window.confirm = jest.fn(() => true)

    const wrapper = renderWithReduxAndIntl(
      <GalleryStreetItem street={MOCK_STREET} doDelete={doDelete} allowDelete />
    )

    fireEvent.click(wrapper.getByTitle('Delete street'))
    expect(doDelete).toBeCalled()
  })

  it('does not delete when confirmation is cancelled', () => {
    const doDelete = jest.fn()
    window.confirm = jest.fn(() => false)

    const wrapper = renderWithReduxAndIntl(
      <GalleryStreetItem street={MOCK_STREET} doDelete={doDelete} allowDelete />
    )

    fireEvent.click(wrapper.getByTitle('Delete street'))
    expect(doDelete).not.toBeCalled()
  })
})
