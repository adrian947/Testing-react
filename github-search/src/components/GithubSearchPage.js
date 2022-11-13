import React, {useState} from 'react'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import TableContainerComponent from './TableContainer';


const GithubSearchPage = () => {
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchingApplied, setIsSearchingApplied] = useState(false)
  const [repoResult, setRepoResult] = useState({})

  return (
    <Container>
      <Typography variant="h3" component="h1">
        gibhub-serarch-page
      </Typography>
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item md={6}>
          <TextField fullWidth label="filter By" id="filter by" />
        </Grid>
        <Grid item md={6}>
          <Button
            fullWidth
            disabled={isSearching}
            color="primary"
            variant="contained"
            onClick={async () => {
              setIsSearching(true)
              const result = await fetch('https://api.github.com/search/repositories?q=react+language:python&page=2&per_page=5')
              const data = await result.json()
              setRepoResult(data)
              setIsSearching(false)
              setIsSearchingApplied(true)
            }}
          >
            Search
          </Button>
        </Grid>
      </Grid>
      {isSearchingApplied ? (
        <TableContainerComponent repoResult={repoResult}/>
      ) : (
        <Box display="flex" justifyContent="center">
          <Typography>
            Please provide a search option and click in the search button
          </Typography>
        </Box>
      )}
    </Container>
  )
}

export default GithubSearchPage
