import React from 'react'
import PropTypes from 'prop-types'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import {Avatar, Link, TablePagination} from '@material-ui/core'

const TableContainerComponent = ({repoResult}) => {
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{minWidth: 650}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>repository</TableCell>
              <TableCell>stars</TableCell>
              <TableCell>forks</TableCell>
              <TableCell>openIssues</TableCell>
              <TableCell>updatedAt</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {repoResult.items.map(e => (
              <TableRow key={e.id}>
                <TableCell>
                  <Avatar alt={e.name} src={e.owner.avatar_url} />
                  <Link href={e.html_url}>{e.name}</Link>
                </TableCell>

                <TableCell>{e.stargazers_count}</TableCell>
                <TableCell>{e.forks_count}</TableCell>
                <TableCell>{e.open_issues_count}</TableCell>
                <TableCell>{e.updated_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[30, 50, 100]}
        component="div"
        count={1}
        rowsPerPage={30}
        page={1}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
      />
    </>
  )
}
export default TableContainerComponent

TableContainerComponent.propTypes = {
  repoResult: PropTypes.shape({
    name: PropTypes.string.isRequired,
    html_url: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
}
