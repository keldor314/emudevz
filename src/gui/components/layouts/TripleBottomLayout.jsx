import classNames from "classnames";
import Layout from "./Layout";
import styles from "./Layout.module.css";

export default class TripleBottomLayout extends Layout {
	static get requiredComponentNames() {
		return ["Left", "Right", "Bottom"];
	}

	state = { selected: "Bottom", lastHorizontalSelection: "Left" };

	render() {
		this.requireComponents();
		const { Left, Right, Bottom } = this.props;
		const { selected } = this.state;

		return (
			<div
				className={styles.verticalContainer}
				onKeyDownCapture={this.onKeyDown}
			>
				<div
					className={classNames(
						styles.topRow,
						styles.row,
						styles.fullRow,
						styles.container
					)}
				>
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

					<div
						className={classNames(
							styles.rightColumn,
							styles.column,
							selected === "Right" ? styles.selected : styles.unselected
						)}
						onMouseDown={(e) => {
							this.focus("Right");
						}}
					>
						<Right
							ref={(ref) => {
								this.instances.Right = ref;
							}}
						/>
					</div>
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
		);
	}

	focus(instanceName) {
		this.setState({ selected: instanceName });

		super.focus(instanceName);
	}

	onKeyDown = (e) => {
		const { selected, lastHorizontalSelection } = this.state;
		const keys = this.getKeyBindings().paneNavigation;
		const key = e.key?.toUpperCase?.() || "";

		if ((key === "ARROWRIGHT" || key === keys.right) && e.altKey) {
			if (selected !== "Right") this.focus("Right");
			e.preventDefault();
			e.stopPropagation();
		}

		if ((key === "ARROWLEFT" || key === keys.left) && e.altKey) {
			if (selected !== "Left") this.focus("Left");
			e.preventDefault();
			e.stopPropagation();
		}

		if ((key === "ARROWUP" || key === keys.up) && e.altKey) {
			if (selected === "Bottom") this.focus(lastHorizontalSelection);
			e.preventDefault();
			e.stopPropagation();
		}

		if ((key === "ARROWDOWN" || key === keys.down) && e.altKey) {
			if (selected !== "Bottom") {
				this.setState({ lastHorizontalSelection: selected });
				this.focus("Bottom");
			}
			e.preventDefault();
			e.stopPropagation();
		}
	};
}
