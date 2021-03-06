import React = require('react')
import { Dialog, DialogContent, DialogFooter } from '../dialog'
import { Repository } from '../../models/repository'
import { Branch } from '../../models/branch'
import { Dispatcher } from '../dispatcher'
import { Row } from '../lib/row'
import { stashOnCurrentBranch } from '../../models/uncommitted-changes-strategy'
import { OkCancelButtonGroup } from '../dialog/ok-cancel-button-group'

interface IOverwriteStashProps {
  readonly dispatcher: Dispatcher
  readonly repository: Repository
  readonly branchToCheckout: Branch
  readonly onDismissed: () => void
}

interface IOverwriteStashState {
  readonly isCheckingOutBranch: boolean
}

/**
 * Dialog that alerts user that their stash will be overwritten
 */
export class OverwriteStash extends React.Component<
  IOverwriteStashProps,
  IOverwriteStashState
> {
  public constructor(props: IOverwriteStashProps) {
    super(props)

    this.state = {
      isCheckingOutBranch: false,
    }
  }

  public render() {
    const title = 'Overwrite Stash?'

    return (
      <Dialog
        id="overwrite-stash"
        type="warning"
        title={title}
        loading={this.state.isCheckingOutBranch}
        disabled={this.state.isCheckingOutBranch}
        onSubmit={this.onSubmit}
        onDismissed={this.props.onDismissed}
      >
        <DialogContent>
          <Row>
            Are you sure you want to proceed? This will overwrite your existing
            stash with your current changes.
          </Row>
        </DialogContent>
        <DialogFooter>
          <OkCancelButtonGroup destructive={true} okButtonText="Overwrite" />
        </DialogFooter>
      </Dialog>
    )
  }

  private onSubmit = async () => {
    const { dispatcher, repository, branchToCheckout, onDismissed } = this.props

    this.setState({
      isCheckingOutBranch: true,
    })

    try {
      await dispatcher.checkoutBranch(
        repository,
        branchToCheckout,
        stashOnCurrentBranch
      )
    } finally {
      this.setState({
        isCheckingOutBranch: false,
      })
    }

    onDismissed()
  }
}
