import React, {useState} from 'react'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

const GithubSearchPage = () => {
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchingApplied, setIsSearchingApplied] = useState(false)

  return (
    <Container>
      <Typography variant="h3" component="h1">
        gibhub-serarch-page
      </Typography>
      <Grid container spacing={2} justify="space-between">
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
              await Promise.resolve()
              setIsSearching(false)
              setIsSearchingApplied(true)
            }}
          >
            Search
          </Button>
        </Grid>
      </Grid>
      {isSearchingApplied ? (
        <table />
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
