import React from 'react'
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import GithubSearchPage from './GithubSearchPage'

beforeEach(() => render(<GithubSearchPage />))
describe('when the GibhubSearchPage is mounted', () => {
  it('There must be a github repositories list page', () => {
    const result = screen.getByText(/gibhub-serarch-page/i)
    expect(result).toBeInTheDocument()
  })
  it('must be input text with label "filter by field', () => {
    const result = screen.getByLabelText(/filter By/i)
    expect(result).toBeInTheDocument()
  })
  it('must be a search button', () => {
    const result = screen.getByRole('button', {name: /search/i})
    expect(result).toBeInTheDocument()
  })
  it('must be a initial msg Please provide a search option and click in the search button', () => {
    const result = screen.getByText(
      /Please provide a search option and click in the search button/i,
    )
    expect(result).toBeInTheDocument()
  })
})

describe('when the developer does a search', () => {
  it('the search button should be disabled until the search is done', async () => {
    const result = screen.getByRole('button', {name: /search/i})
    expect(result).not.toBeDisabled()

    // click in button
    fireEvent.click(result)

    // expect disable
    expect(result).toBeDisabled()

    // not disable
    await waitFor(() => expect(result).not.toBeDisabled())
  })
  it('The data should be displayed as a sticky table', async () => {
    const button = screen.getByRole('button', {name: /search/i})
    expect(button).not.toBeDisabled()

    // click in button
    fireEvent.click(button)

    // not initial state msg

    // table
    await waitFor(() => {
      const text = screen.queryByText( // query by text si el texto no lo encuentra no tirara error
        /Please provide a search option and click in the search button/i,
      )
      const table = screen.getByRole('table');
      
      expect(text).not.toBeInTheDocument()
      expect(table).toBeInTheDocument()
      
    })
  })
})
