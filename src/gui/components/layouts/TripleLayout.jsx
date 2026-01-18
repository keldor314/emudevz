import classNames from "classnames";
import Layout from "./Layout";
import styles from "./Layout.module.css";

export default class TripleLayout extends Layout {
	static get requiredComponentNames() {
		return ["Left", "Top", "Bottom"];
	}

	state = { selected: "Left", lastVerticalSelection: "Bottom" };

	render() {
		this.requireComponents();
		const { Left, Top, Bottom } = this.props;
		const { selected } = this.state;

		return (
			<div className={styles.container} onKeyDownCapture={this.onKeyDown}>
				<div
					className={classNames(
						styles.leftColumn,
						styles.column,
						selected === "Left" ? styles.selected : styles.unselected
					)}
					onMouseDown={(e) => {
						this.focus("Left");
					}}
				>
					<Left
						ref={(ref) => {
							this.instances.Left = ref;
						}}
					/>
				</div>

				<div className={classNames(styles.rightColumn, styles.column)}>
					<div
						className={classNames(
							styles.topRow,
							styles.row,
							selected === "Top" ? styles.selected : styles.unselected
						)}
						onMouseDown={(e) => {
							this.focus("Top");
						}}
					>
						<Top
							ref={(ref) => {
								this.instances.Top = ref;
							}}
						/>
					</div>

					<div
						className={classNames(
							styles.bottomRow,
							styles.row,
							selected === "Bottom" ? styles.selected : styles.unselected
						)}
						onMouseDown={(e) => {
							this.focus("Bottom");
						}}
					>
						<Bottom
							ref={(ref) => {
								this.instances.Bottom = ref;
							}}
						/>
					</div>
				</div>
			</div>
		);
	}

	focus(instanceName) {
		this.setState({ selected: instanceName });

		super.focus(instanceName);
	}

	onKeyDown = (e) => {
		const { selected, lastVerticalSelection } = this.state;
		const keys = this.getKeyBindings().paneNavigation;
		const key = e.key?.toUpperCase?.() || "";

		if ((key === "ARROWRIGHT" || key === keys.right) && e.altKey) {
			if (selected === "Left") this.focus(lastVerticalSelection);
			e.preventDefault();
			e.stopPropagation();
		}

		if ((key === "ARROWLEFT" || key === keys.left) && e.altKey) {
			if (selected !== "Left") {
				this.setState({ lastVerticalSelection: selected });
				this.focus("Left");
			}
			e.preventDefault();
			e.stopPropagation();
		}

		if ((key === "ARROWUP" || key === keys.up) && e.altKey) {
			if (selected !== "Top") this.focus("Top");
			e.preventDefault();
			e.stopPropagation();
		}

		if ((key === "ARROWDOWN" || key === keys.down) && e.altKey) {
			if (selected !== "Bottom") this.focus("Bottom");
			e.preventDefault();
			e.stopPropagation();
		}
	};
}
