import React from 'react'
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import GithubSearchPage from './GithubSearchPage'

const fakeRepo = {
  id: '68942374',
  name: 'saleor',
  owner: {
    avatar_url: 'https://avatars.githubusercontent.com/u/13796165?v=4',
  },
  html_url: 'https://github.com/saleor/saleor',
  updated_at: '2022-11-13',
  stargazers_count: 17198,
  forks_count: 4768,
  open_issues_count: 338,
}

const server = setupServer(
  rest.get('/search/repositories', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        total_count: 30258,
        incomplete_results: false,
        items: [fakeRepo],
      }),
    )
  }),
)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

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
  const button = () => screen.getByRole('button', {name: /search/i})
  it('the search button should be disabled until the search is done', async () => {
    expect(button()).not.toBeDisabled()

    // click in button
    fireEvent.click(button())

    // expect disable
    expect(button()).toBeDisabled()

    // not disable
    await waitFor(() => expect(button()).not.toBeDisabled())
  })
  it('The data should be displayed as a sticky table', async () => {
    expect(button()).not.toBeDisabled()

    // click in button
    fireEvent.click(button())

    // not initial state msg

    // table
    await waitFor(() => {
      const text = screen.queryByText(
        // query by text si el texto no lo encuentra no tirara error
        /Please provide a search option and click in the search button/i,
      )
      const table = screen.getByRole('table')

      expect(text).not.toBeInTheDocument()
      expect(table).toBeInTheDocument()
    })
  })

  it('The header table should contain: Repository, stars, forks, openIssues and updatedAt', async () => {
    fireEvent.click(button())

    const table = await screen.findByRole('table')

    const tableHeaders = within(table).getAllByRole('columnheader')

    expect(tableHeaders).toHaveLength(5)
    expect(tableHeaders[0]).toHaveTextContent(/Repository/i)
    expect(tableHeaders[1]).toHaveTextContent(/stars/i)
    expect(tableHeaders[2]).toHaveTextContent(/forks/i)
    expect(tableHeaders[3]).toHaveTextContent(/openIssues/i)
    expect(tableHeaders[4]).toHaveTextContent(/updatedAt/i)
  })

  it('Each result should have: owner avatar image, name, stars, updated at, forks, openIssues', async () => {
    fireEvent.click(button())
    const table = await screen.findByRole('table')
    const tableCells = within(table).getAllByRole('cell')
    const tableImg = within(table).getAllByRole('img', {name: fakeRepo.name})

    expect(tableImg)

    expect(tableCells).toHaveLength(25)

    expect(tableCells[0]).toHaveTextContent(fakeRepo.name)
    expect(tableCells[1]).toHaveTextContent(fakeRepo.stargazers_count)
    expect(tableCells[2]).toHaveTextContent(fakeRepo.forks_count)
    expect(tableCells[3]).toHaveTextContent(fakeRepo.open_issues_count)
    expect(tableCells[4]).toHaveTextContent(fakeRepo.updated_at)
  })
  it('It should have a link that opens in a new tab the github repository selected', async () => {
    fireEvent.click(button())
    const table = await screen.findByRole('table')
    const tableNode = within(table).getByText(fakeRepo.name).closest('a')
    const tableCells = within(table).getAllByRole('cell')    
    const avatarImg = within(tableCells[0]).getByRole('img', {name: fakeRepo.name})

    expect(tableNode).toHaveAttribute('href', fakeRepo.html_url)
    expect(avatarImg).toHaveAttribute('src', fakeRepo.owner.avatar_url)
  })
  it('Total results number of the search and the current number of results. Example: 1-10 of 100.', async () => {
    fireEvent.click(button())
    await screen.findByRole('table')

    expect(screen.getByText(/31-1 of 1/)).toBeInTheDocument()
  })
  it('A results size per page select/combobox with the options: 30, 50, 100. The default is 30.', async () => {
    fireEvent.click(button())
    await screen.findByRole('table')

    expect(screen.getByLabelText(/Rows per page:/)).toBeInTheDocument()

    fireEvent.mouseDown(screen.getByLabelText(/Rows per page:/))

    const listBox = screen.getByRole('listbox', {name: /rows per page/i})

    const options = within(listBox).getAllByRole('option')

    expect(options).toHaveLength(3)

    const [option5, option10, option25] = options
    expect(option5).toHaveTextContent(30)
    expect(option10).toHaveTextContent(50)
    expect(option25).toHaveTextContent(100)
  })

  it('Next and previous pagination when the context applies to them, example: on the first page, the previous page should be disabled.', async () => {
    fireEvent.click(button())
    await screen.findByRole('table')
    const buttonP = screen.getByRole('button', {name: /previous page/i})
    const buttonN = screen.getByRole('button', {name: /next page/i})

    expect(buttonP).toBeInTheDocument()
    expect(buttonN).toBeInTheDocument()
  })
})
